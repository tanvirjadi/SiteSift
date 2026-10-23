const axios = require('axios');

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

async function runAuditorAgent({ crawlResult, extractedBlueprint, speedMetrics, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const { primaryUrl, domain, primaryPage } = crawlResult;
  const businessVertical = extractedBlueprint?.vertical || 'General Business';

  const systemPrompt = `You are Agent 2 (The Conversion & Revenue Leak Auditor) for SiteSift.
You are a world-class Conversion Rate Optimization (CRO) expert, UX strategist, and growth marketer.
You audit websites according to Nielsen's 10 Usability Heuristics, F-Pattern reading behavior, and Cialdini's Persuasion Principles.

BUSINESS VERTICAL CONTEXT: "${businessVertical}".
Adapt your audit rules strictly to this vertical:
- B2B SaaS: Focus on free trial friction, value proposition within 5 seconds, clear pricing tiers, demo CTA clarity.
- E-Commerce / D2C: Focus on cart abandonment, shipping transparency, product imagery alt tags, security seals.
- Local Service: Focus on click-to-call, service areas, Google reviews, response time guarantees.
- Portfolio / Agency: Focus on case studies, social proof, Calendly booking ease.

ANTI-HALLUCINATION RULE:
If an element (such as an image or a primary button) is missing from the extracted payload, do not invent placeholder data. Report it as "Not Found" so the audit can accurately flag it as a missing conversion asset.

SEVERITY PRIORITIZATION:
You MUST group weaknesses logically under three distinct levels:
1. Critical Flaws: Immediate fixes causing sales leaks, above-the-fold ambiguity, broken trust, missing H1 or CTAs.
2. Optimization Opportunities: Secondary uplifts, copy polish, missing alt tags, form field consolidation.
3. Passed Elements: What the site is doing well that they should preserve.

You MUST respond strictly with valid JSON without any markdown formatting or commentary outside the JSON.
Your JSON must strictly match this structure:
{
  "siteHealthScore": 72,
  "revenueRiskLevel": "Critical" | "High" | "Medium" | "Low",
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
  "criticalFlaws": [
    {
      "id": "CRIT-01",
      "heuristic": "Match between system and real world / Visibility of system status",
      "issue": "Specific critical issue",
      "location": "Above-the-fold Hero / Lead Form / Pricing Table / Footer",
      "conversionImpact": "Why visitors bounce and lost revenue consequence.",
      "actionableFix": "Concrete, step-by-step fix.",
      "effort": "Quick Win (<1h)"
    }
  ],
  "optimizationOpportunities": [
    {
      "id": "OPT-01",
      "issue": "Specific optimization issue",
      "location": "Navigation / Image Assets / Secondary Copy",
      "conversionImpact": "Projected uplift from fixing this.",
      "actionableFix": "Step-by-step fix.",
      "effort": "Moderate (1-3h)"
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
  ],
  "passedElements": [
    "Confirmed passed element 1",
    "Confirmed passed element 2"
  ]
}`;

  const userPrompt = `Audit the website weaknesses for business owner:
Target URL: ${primaryUrl}
Domain: ${domain}
Business Vertical: ${businessVertical}

--- AGENT 1 STRUCTURED BLUEPRINT ---
Business Name: ${extractedBlueprint.businessName || 'Not Found'}
Tagline: ${extractedBlueprint.tagline || 'Not Found'}
Value Proposition: ${extractedBlueprint.valueProposition || 'Not Found'}
Target Audience: ${JSON.stringify(extractedBlueprint.targetAudience || {})}
Core Offerings: ${JSON.stringify(extractedBlueprint.coreOfferings || [])}
Primary Conversion Goal: ${extractedBlueprint.primaryConversionGoal || 'Not Found'}
CTAs Found: ${JSON.stringify(extractedBlueprint.ctaInventory || primaryPage.ctas || [])}
Pricing Model: ${extractedBlueprint.pricingModel || 'Not Found'}
Trust Signals Found: ${JSON.stringify(extractedBlueprint.trustSignalsDetected || [])}
Content Tone: ${extractedBlueprint.contentToneAndClarity || 'Not Found'}

--- TECHNICAL SIGNALS & CORE WEB VITALS ---
Speed Performance Score: ${speedMetrics?.performanceScore ? `${speedMetrics.performanceScore}/100 (${speedMetrics.grade})` : 'N/A'}
LCP (Largest Contentful Paint): ${speedMetrics?.lcp || 'N/A'}
CLS (Cumulative Layout Shift): ${speedMetrics?.cls || 'N/A'}
FCP (First Contentful Paint): ${speedMetrics?.fcp || 'N/A'}
Page Title: "${primaryPage.metadata?.title || 'Not Found'}" (Length: ${primaryPage.metadata?.title?.length || 0} chars)
Meta Description: "${primaryPage.metadata?.description || 'Not Found'}" (Length: ${primaryPage.metadata?.description?.length || 0} chars)
H1 Tags: ${JSON.stringify(primaryPage.headings?.h1 || [])}
H2 Tags: ${JSON.stringify(primaryPage.headings?.h2?.slice(0, 6) || [])}
Word Count: ${primaryPage.metrics?.wordCount || 0}
Images Total: ${primaryPage.metrics?.totalImages || 0} | Missing Alt Tags: ${primaryPage.metrics?.missingAltCount || 0}
Forms Count: ${primaryPage.metrics?.formsCount || 0}
Internal Links: ${primaryPage.metrics?.internalLinksCount || 0} | External: ${primaryPage.metrics?.externalLinksCount || 0}
Contact Email/Phone: ${JSON.stringify(primaryPage.contactLinks || {})}

Deliver 5 to 8 detailed, realistic weaknesses categorized by severity that are actively causing customer drop-off.
Populate criticalFlaws, optimizationOpportunities, passedElements, weaknesses, and topQuickWins.
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
      max_tokens: 3000,
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
    const parsed = JSON.parse(cleaned);

    // Normalize weaknesses array to make sure both criticalFlaws and legacy weaknesses are populated
    if (!parsed.weaknesses || !parsed.weaknesses.length) {
      parsed.weaknesses = [
        ...(parsed.criticalFlaws || []).map((f) => ({
          id: f.id,
          category: 'Critical Conversion Flaw',
          severity: 'Critical',
          issue: f.issue,
          dropoffLocation: f.location,
          customerCost: f.conversionImpact,
          actionableFix: f.actionableFix,
          effort: f.effort || 'Quick Win (<1h)',
        })),
        ...(parsed.optimizationOpportunities || []).map((o) => ({
          id: o.id,
          category: 'Optimization Opportunity',
          severity: 'Moderate',
          issue: o.issue,
          dropoffLocation: o.location || 'Page Experience',
          customerCost: o.conversionImpact,
          actionableFix: o.actionableFix,
          effort: o.effort || 'Moderate (1-3h)',
        })),
      ];
    }

    if (!parsed.passedElements && parsed.strengths) {
      parsed.passedElements = parsed.strengths;
    }

    return parsed;
  } catch (err) {
    throw new Error(`Failed to parse Agent 2 JSON response: ${err.message}. Raw: ${rawContent.slice(0, 200)}`);
  }
}

module.exports = {
  runAuditorAgent,
};
