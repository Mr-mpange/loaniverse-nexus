import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "audit_critical" | "integration_alert";
  subject: string;
  message: string;
  details?: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, subject, message, details }: NotificationRequest = await req.json();

    console.log(`Processing ${type} notification: ${subject}`);

    // Fetch users who have this notification type enabled
    const column = type === "audit_critical" ? "audit_critical" : "integration_alerts";
    const { data: subscribers, error: fetchError } = await supabase
      .from("notification_settings")
      .select("email, user_id")
      .eq(column, true);

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw new Error("Failed to fetch notification subscribers");
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers for this notification type");
      return new Response(
        JSON.stringify({ message: "No subscribers to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const result = await resend.emails.send({
          from: "LMA NEXUS <notifications@resend.dev>",
          to: [subscriber.email],
          subject: `[LMA NEXUS] ${subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 24px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 24px; }
                .content { padding: 32px; }
                .alert-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
                .alert-critical { background: #fef2f2; color: #dc2626; }
                .alert-warning { background: #fffbeb; color: #d97706; }
                .message { font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px; }
                .details { background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 16px; }
                .details-title { font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
                .details-item { font-size: 14px; color: #374151; margin: 4px 0; }
                .footer { padding: 20px; text-align: center; background: #f9fafb; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⚡ LMA NEXUS</h1>
                </div>
                <div class="content">
                  <span class="alert-badge ${type === 'audit_critical' ? 'alert-critical' : 'alert-warning'}">
                    ${type === 'audit_critical' ? '🚨 Critical Alert' : '⚠️ Integration Alert'}
                  </span>
                  <h2 style="margin: 0 0 16px; color: #111827;">${subject}</h2>
                  <p class="message">${message}</p>
                  ${details ? `
                    <div class="details">
                      <div class="details-title">Details</div>
                      ${Object.entries(details).map(([key, value]) => 
                        `<div class="details-item"><strong>${key}:</strong> ${value}</div>`
                      ).join('')}
                    </div>
                  ` : ''}
                </div>
                <div class="footer">
                  You're receiving this because you have ${type === 'audit_critical' ? 'critical audit alerts' : 'integration alerts'} enabled in LMA NEXUS.
                </div>
              </div>
            </body>
            </html>
          `,
        });
        return { success: true, email: subscriber.email, result };
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Successfully sent ${successCount}/${results.length} notifications`);

    return new Response(
      JSON.stringify({ 
        message: `Sent ${successCount} notifications`,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-notification function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
