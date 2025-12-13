import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScheduledReport {
  id: string;
  user_id: string;
  report_name: string;
  template_id: string;
  frequency: string;
  recipients: string[];
  sections: any[];
  date_range: string;
}

const generateReportContent = (report: ScheduledReport): string => {
  const templateNames: Record<string, string> = {
    portfolio: "Portfolio Performance",
    risk: "Risk Assessment",
    compliance: "Compliance Report",
    esg: "ESG Report",
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
    .content { padding: 32px; color: #e2e8f0; }
    .metric-card { background: #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .metric-label { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    .metric-value { color: #f1f5f9; font-size: 24px; font-weight: 600; }
    .metric-change { font-size: 14px; }
    .positive { color: #22c55e; }
    .section-title { color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 24px 0 12px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
    .table th { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    .table td { color: #e2e8f0; }
    .footer { padding: 24px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 ${report.report_name}</h1>
      <p>${templateNames[report.template_id] || "Custom Report"} • ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="content">
      <div class="metric-card">
        <div class="metric-label">Portfolio Value</div>
        <div class="metric-value">$4.68B</div>
        <div class="metric-change positive">↑ 12.4% from last period</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="metric-card">
          <div class="metric-label">Risk Score</div>
          <div class="metric-value">56/100</div>
          <div class="metric-change">Moderate</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">ESG Score</div>
          <div class="metric-value">78/100</div>
          <div class="metric-change positive">↑ 8 pts</div>
        </div>
      </div>

      <div class="section-title">Portfolio Summary</div>
      <table class="table">
        <tr>
          <th>Category</th>
          <th>Status</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Term Loans</td>
          <td>Active</td>
          <td>$2.1B</td>
        </tr>
        <tr>
          <td>Revolving Credit</td>
          <td>Active</td>
          <td>$1.2B</td>
        </tr>
        <tr>
          <td>Bridge Loans</td>
          <td>Active</td>
          <td>$0.7B</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      <p>This is an automated report from LMA NEXUS.</p>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { reportId, manual } = await req.json();

    let reports: ScheduledReport[] = [];

    if (reportId) {
      // Manual trigger for specific report
      const { data, error } = await supabase
        .from("scheduled_reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (error) throw error;
      reports = [data];
    } else {
      // Cron job - get all reports due to run
      const { data, error } = await supabase
        .from("scheduled_reports")
        .select("*")
        .eq("is_active", true)
        .lte("next_run_at", new Date().toISOString());

      if (error) throw error;
      reports = data || [];
    }

    console.log(`Processing ${reports.length} scheduled reports`);

    const results = [];

    for (const report of reports) {
      if (report.recipients.length === 0) {
        console.log(`Skipping report ${report.id}: no recipients`);
        continue;
      }

      const htmlContent = generateReportContent(report);

      try {
        const emailResponse = await resend.emails.send({
          from: "LMA NEXUS <onboarding@resend.dev>",
          to: report.recipients,
          subject: `📊 ${report.report_name} - ${new Date().toLocaleDateString()}`,
          html: htmlContent,
        });

        console.log(`Email sent for report ${report.id}:`, emailResponse);

        // Calculate next run time
        const now = new Date();
        let nextRun: Date;

        switch (report.frequency) {
          case "daily":
            nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case "weekly":
            nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case "monthly":
            nextRun = new Date(now.setMonth(now.getMonth() + 1));
            break;
          default:
            nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        // Update report with last sent and next run times
        await supabase
          .from("scheduled_reports")
          .update({
            last_sent_at: new Date().toISOString(),
            next_run_at: nextRun.toISOString(),
          })
          .eq("id", report.id);

        results.push({ reportId: report.id, status: "sent", recipients: report.recipients.length });
      } catch (emailError: any) {
        console.error(`Failed to send report ${report.id}:`, emailError);
        results.push({ reportId: report.id, status: "failed", error: emailError.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-scheduled-report:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
