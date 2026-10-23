const axios = require('axios');

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

async function runExtractionAgent({ crawlResult, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const { primaryUrl, domain, primaryPage, crawledPages, combinedContent } = crawlResult;

  const systemPrompt = `You are Agent 1 (Extraction & Structuring Agent) for SiteSift, a professional web audit and conversion intelligence system.
Your job is to analyze raw website crawl data, metadata, headings, CTAs, forms, and page content, and distill it into a clean, comprehensive, structured business blueprint.

You MUST respond strictly with valid JSON without any markdown formatting or commentary outside the JSON.
Your JSON must strictly match this structure:
{
  "businessName": "Name of the business or product",
  "tagline": "Short tagline or detected main slogan",
  "valueProposition": "Crisp 1-2 sentence description of their core value proposition and what problem they solve",
  "targetAudience": {
    "profile": "Description of ideal customer profile (e.g., B2B SaaS founders, D2C shoppers, local homeowners)",
    "marketSegment": "SMB / Enterprise / Consumer / Prosumer"
  },
  "coreOfferings": [
    "Key service/product 1",
    "Key service/product 2",
    "Key service/product 3"
  ],
  "primaryConversionGoal": "The main action the website wants visitors to take (e.g., 'Book a Discovery Call', 'Start 14-day Free Trial', 'Purchase eCommerce product')",
  "ctaInventory": [
    { "text": "CTA button text", "context": "Above fold hero / Navigation / Footer" }
  ],
  "pricingModel": "Disclosed Tiers / Custom Quote / Freemium / Hidden / Not Mentioned",
  "trustSignalsDetected": [
    "Detected social proof (client logos, customer reviews, security badges, years in business, case studies)"
  ],
  "contentToneAndClarity": "Description of the messaging style (e.g., punchy, jargon-heavy, corporate, vague, developer-focused)",
  "executiveSummary": "A concise 3-4 sentence overview of the website's structure, offerings, and current conversion flow."
}`;

  const userPrompt = `Analyze the crawled website data for:
URL: ${primaryUrl}
Domain: ${domain}
Total Pages Crawled: ${crawledPages.length}
Primary Title: ${primaryPage.metadata.title}
Meta Description: ${primaryPage.metadata.description}
Headings H1: ${JSON.stringify(primaryPage.headings.h1)}
Headings H2: ${JSON.stringify(primaryPage.headings.h2.slice(0, 8))}
Detected CTAs: ${JSON.stringify(primaryPage.ctas)}
Contact Info: ${JSON.stringify(primaryPage.contactLinks)}
Social Links: ${JSON.stringify(primaryPage.socialLinks)}

WEBSITE CONTENT TRANSCRIPT:
${combinedContent.slice(0, 4500)}

Extract the structured business and content blueprint now as strictly valid JSON.`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sitesift.local',
        'X-Title': 'SiteSift AI Crawler',
      },
      timeout: 45000,
    }
  );

  const rawContent = response.data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Empty response received from OpenRouter Agent 1');
  }

  let cleaned = rawContent.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Agent 1 JSON response: ${err.message}. Raw: ${rawContent.slice(0, 200)}`);
  }
}

module.exports = {
  runExtractionAgent,
};
