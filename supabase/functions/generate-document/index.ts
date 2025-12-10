import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "credit_agreement":
        systemPrompt = `You are an expert legal document generator specializing in LMA-compliant syndicated loan documentation. Generate professional credit agreements following industry standards.`;
        userPrompt = `Generate a credit agreement with the following details:
- Borrower: ${context.borrower}
- Facility Amount: ${context.amount}
- Currency: ${context.currency}
- Tenor: ${context.tenor}
- Purpose: ${context.purpose}
- Interest Rate: ${context.rate}

Include standard LMA clauses for representations, covenants, events of default, and conditions precedent.`;
        break;

      case "term_sheet":
        systemPrompt = `You are an expert in syndicated lending. Generate clear, professional term sheets that outline key commercial terms.`;
        userPrompt = `Generate a term sheet with the following details:
- Borrower: ${context.borrower}
- Facility: ${context.facility}
- Amount: ${context.amount}
- Tenor: ${context.tenor}
- Pricing: ${context.pricing}
- Security: ${context.security}`;
        break;

      case "amendment":
        systemPrompt = `You are an expert in loan documentation amendments. Generate professional amendment letters that clearly specify changes to existing agreements.`;
        userPrompt = `Generate an amendment for the following:
- Original Agreement: ${context.originalAgreement}
- Amendment Type: ${context.amendmentType}
- Changes: ${context.changes}
- Effective Date: ${context.effectiveDate}`;
        break;

      default:
        throw new Error("Unknown document type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-document function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
