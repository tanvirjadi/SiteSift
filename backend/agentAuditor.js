const axios = require('axios');

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

async function runAuditorAgent({ crawlResult, extractedBlueprint, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const { primaryUrl, domain, primaryPage } = crawlResult;

  const systemPrompt = `You are Agent 2 (The Conversion & Revenue Leak Auditor) for SiteSift.
You are a world-class Conversion Rate Optimization (CRO) expert, UX strategist, and growth marketer who has audited hundreds of 7-figure websites.

Your mission is to analyze the website data provided by Agent 1 and the technical crawler, and tell the business owner the brutally honest truth about the weaknesses on their website that are costing them paying customers and leads.

Avoid vague corporate buzzwords and AI clichés. Give razor-sharp, actionable, and revenue-centric insights.
Focus on:
1. Value Proposition & The 5-Second Test (Does a visitor immediately understand what you do, who it's for, and why care?)
2. Call to Action (CTA) Clarity & Placement (Are next steps obvious, frictionless, and compelling, or hidden and weak?)
3. Trust & Risk Reversal (Are testimonials, logos, security seals, and proof presented where buying hesitation occurs?)
4. User Experience & Friction (Are forms too long? Is copy too dense? Are images missing alt tags? Is navigation confusing?)
5. SEO & Click-Through Appeal (Will people click their Google search listing based on title/meta description?)
6. Pricing & Buyer Hesitation (Are objections addressed before they bounce?)

You MUST respond strictly with valid JSON without any markdown formatting or commentary outside the JSON.
Your JSON must strictly match this structure:
{
  "siteHealthScore": 72,
  "revenueRiskLevel": "High",
  "estimatedMonthlyBounceCost": "High risk of losing 30-50% of first-time organic and paid traffic due to above-the-fold ambiguity",
  "executiveSummary": "Direct, professional, 3-4 sentence message directly to the business owner explaining the primary revenue bottleneck.",
  "topQuickWins": [
    {
      "title": "Clear headline fix",
      "impact": "Reduces immediate bounce rate by making the core offer instantly obvious.",
      "action": "Change H1 from generic phrase to outcome-driven benefit statement."
    },
    {
      "title": "High-contrast hero CTA",
      "impact": "Increases click-through into the onboarding funnel.",
      "action": "Add a prominent contrasting button above the fold."
    },
    {
      "title": "Add social proof near decision point",
      "impact": "Counteracts buyer skepticism right before they sign up.",
      "action": "Place client logos or a 5-star rating directly underneath the primary CTA."
    }
  ],
  "weaknesses": [
    {
      "id": "WEAK-01",
      "category": "Value Proposition & Clarity",
      "severity": "Critical",
      "issue": "Specific weakness title",
      "dropoffLocation": "Above-the-fold Hero / Lead Form / Pricing Table / Footer",
      "customerCost": "Detailed explanation of why visitors bounce and how this directly causes lost revenue or lost leads.",
      "actionableFix": "Concrete, step-by-step fix including proposed headline copy, visual hierarchy, or button text.",
      "effort": "Quick Win (<1h)"
    }
  ],
  "strengths": [
    "What the site is doing well that they should preserve"
  ]
}`;

  const userPrompt = `Audit the website weaknesses for business owner:
Target URL: ${primaryUrl}
Domain: ${domain}

--- AGENT 1 STRUCTURED BLUEPRINT ---
Business Name: ${extractedBlueprint.businessName || 'Unknown'}
Tagline: ${extractedBlueprint.tagline || 'None'}
Value Proposition: ${extractedBlueprint.valueProposition || 'None'}
Target Audience: ${JSON.stringify(extractedBlueprint.targetAudience)}
Core Offerings: ${JSON.stringify(extractedBlueprint.coreOfferings)}
Primary Conversion Goal: ${extractedBlueprint.primaryConversionGoal}
CTAs Found: ${JSON.stringify(extractedBlueprint.ctaInventory || primaryPage.ctas)}
Pricing Model: ${extractedBlueprint.pricingModel}
Trust Signals Found: ${JSON.stringify(extractedBlueprint.trustSignalsDetected)}
Content Tone: ${extractedBlueprint.contentToneAndClarity}

--- TECHNICAL & ON-PAGE SIGNALS ---
Page Title: "${primaryPage.metadata.title}" (Length: ${primaryPage.metadata.title?.length || 0} chars)
Meta Description: "${primaryPage.metadata.description}" (Length: ${primaryPage.metadata.description?.length || 0} chars)
H1 Tags: ${JSON.stringify(primaryPage.headings.h1)}
H2 Tags: ${JSON.stringify(primaryPage.headings.h2.slice(0, 6))}
Word Count: ${primaryPage.metrics.wordCount}
Estimated Read Time: ${primaryPage.metrics.readingTimeMinutes} min
Response Time: ${primaryPage.responseTimeMs}ms
Images Total: ${primaryPage.metrics.totalImages} | Missing Alt Tags: ${primaryPage.metrics.missingAltCount}
Forms Count: ${primaryPage.metrics.formsCount}
Internal Links: ${primaryPage.metrics.internalLinksCount} | External: ${primaryPage.metrics.externalLinksCount}
Contact Email/Phone: ${JSON.stringify(primaryPage.contactLinks)}

Deliver 5 to 8 detailed, realistic weaknesses categorized by severity that are actively causing customer drop-off.
Respond ONLY with the strict JSON structure.`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sitesift.local',
        'X-Title': 'SiteSift AI Auditor',
      },
      timeout: 55000,
    }
  );

  const rawContent = response.data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Empty response received from OpenRouter Agent 2');
  }

  let cleaned = rawContent.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Agent 2 JSON response: ${err.message}. Raw: ${rawContent.slice(0, 200)}`);
  }
}

module.exports = {
  runAuditorAgent,
};
