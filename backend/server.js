const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const { crawlWebsite, normalizeUrl } = require('./crawler');
const { runExtractionAgent } = require('./agentExtractor');
const { runAuditorAgent } = require('./agentAuditor');
const { generateSiteSiftCsv } = require('./csvExport');
const { sampleAnalysisData } = require('./sampleData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/status', (req, res) => {
  const hasEnvKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 5);
  res.json({
    status: 'online',
    tool: 'SiteSift',
    hasEnvKey,
    isVercel: Boolean(process.env.VERCEL),
    defaultModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  });
});

app.get('/api/sample', (req, res) => {
  res.json(sampleAnalysisData);
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { url, apiKey: customKey, model, maxPages = 3 } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please provide a valid website URL to audit.' });
    }

    const effectiveApiKey = (customKey || req.headers['x-openrouter-key'] || process.env.OPENROUTER_API_KEY || '').trim();

    if (!effectiveApiKey) {
      return res.status(400).json({
        error: 'No OpenRouter API key found. Enter your API key in the settings modal or set OPENROUTER_API_KEY in your Vercel Environment Variables.',
        missingApiKey: true,
      });
    }

    const normalizedUrl = normalizeUrl(url);

    let crawlResult;
    try {
      crawlResult = await crawlWebsite(normalizedUrl, Math.min(Number(maxPages) || 3, 5));
    } catch (crawlErr) {
      return res.status(422).json({
        error: `Could not crawl ${normalizedUrl}: ${crawlErr.message}. Verify that the site is live and reachable.`,
      });
    }

    let extractedBlueprint;
    try {
      extractedBlueprint = await runExtractionAgent({
        crawlResult,
        apiKey: effectiveApiKey,
        model: model || process.env.OPENROUTER_MODEL,
      });
    } catch (agent1Err) {
      const detail = agent1Err.response?.data?.error?.message || agent1Err.message;
      return res.status(502).json({
        error: `Agent 1 Extraction failed: ${detail}`,
      });
    }

    let auditResult;
    try {
      auditResult = await runAuditorAgent({
        crawlResult,
        extractedBlueprint,
        apiKey: effectiveApiKey,
        model: model || process.env.OPENROUTER_MODEL,
      });
    } catch (agent2Err) {
      const detail = agent2Err.response?.data?.error?.message || agent2Err.message;
      return res.status(502).json({
        error: `Agent 2 Auditor failed: ${detail}`,
      });
    }

    res.json({
      targetUrl: crawlResult.primaryUrl,
      domain: crawlResult.domain,
      analyzedAt: new Date().toISOString(),
      crawlResult,
      extractedBlueprint,
      auditResult,
    });
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.post('/api/export-csv', (req, res) => {
  try {
    const analysisData = req.body;
    if (!analysisData || !analysisData.crawlResult) {
      return res.status(400).json({ error: 'Invalid analysis payload provided.' });
    }

    const csvContent = generateSiteSiftCsv(analysisData);
    const domain = analysisData.crawlResult?.domain || 'audit-report';
    const filename = `sitesift-${domain}-${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: `Failed to export CSV: ${err.message}` });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SiteSift Server] Active at http://localhost:${PORT}`);
  });
}

module.exports = app;
