const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const { crawlWebsite, normalizeUrl } = require('./crawler');
const { runExtractionAgent } = require('./agentExtractor');
const { runAuditorAgent } = require('./agentAuditor');
const { fetchCoreWebVitals } = require('./coreWebVitals');
const { generateSiteSiftCsv } = require('./csvExport');
const { buildAuditPdfStream } = require('./pdfExport');
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
    engine: 'Antigravity Zero-G Orchestrator v2.0',
    hasEnvKey,
    isVercel: Boolean(process.env.VERCEL),
    defaultModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  });
});

app.get('/api/sample', (req, res) => {
  res.json(sampleAnalysisData);
});

// Primary Analysis Pipeline with Zero-G Protocol & Core Web Vitals
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, maxPages = 3 } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please provide a valid website URL to audit.' });
    }

    const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY is not configured on the server. Please add it to your .env file.',
      });
    }

    const normalizedUrl = normalizeUrl(url);

    // 1. Zero-G Resilient Extraction Layer
    let crawlResult;
    try {
      crawlResult = await crawlWebsite(normalizedUrl, Math.min(Number(maxPages) || 3, 5));
    } catch (crawlErr) {
      return res.status(422).json({
        error: `Could not reach ${normalizedUrl}: ${crawlErr.message}. Verify that the site is live and reachable.`,
      });
    }

    // Intercept Anti-Bot Challenge Wall with graceful diagnostic reporting
    if (crawlResult.primaryPage?.blocked || crawlResult.crawl_meta?.status === 'blocked') {
      return res.status(403).json({
        status: 'restricted_access',
        cause: 'anti_scraping_wall',
        error: `Access to ${normalizedUrl} is protected by an anti-scraping firewall or Cloudflare challenge. Deep crawl aborted gracefully.`,
        system_diagnostics: crawlResult.system_diagnostics || {
          payload_size_kb: 0,
          retries_attempted: 1,
        },
      });
    }

    // 2. Fetch Core Web Vitals in parallel with context preparation
    const speedMetrics = await fetchCoreWebVitals(normalizedUrl);

    // 3. Multi-Agent Extraction & Business Vertical Identification
    let extractedBlueprint;
    try {
      extractedBlueprint = await runExtractionAgent({
        crawlResult,
        apiKey,
        model: process.env.OPENROUTER_MODEL,
      });
    } catch (agent1Err) {
      const detail = agent1Err.response?.data?.error?.message || agent1Err.message;
      return res.status(502).json({
        error: `Agent 1 Extraction failed: ${detail}`,
      });
    }

    // 4. Multi-Agent Heuristic Auditing with 3-Tier Severity & Speed Data
    let auditResult;
    try {
      auditResult = await runAuditorAgent({
        crawlResult,
        extractedBlueprint,
        speedMetrics,
        apiKey,
        model: process.env.OPENROUTER_MODEL,
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
      speedMetrics,
      crawl_meta: crawlResult.crawl_meta || {
        target_url: crawlResult.primaryUrl,
        execution_time_ms: crawlResult.primaryPage?.responseTimeMs || 0,
        status: 'success',
      },
      system_diagnostics: crawlResult.system_diagnostics || {
        payload_size_kb: crawlResult.primaryPage?.system_diagnostics?.payload_size_kb || 0,
        retries_attempted: 0,
      },
      crawlResult,
      extractedBlueprint,
      auditResult,
    });
  } catch (err) {
    res.status(500).json({
      error: `An unexpected orchestrator error occurred: ${err.message}`,
    });
  }
});

// PDF Export Endpoint
app.post('/api/export/pdf', (req, res) => {
  try {
    const auditData = req.body;
    if (!auditData || !auditData.domain) {
      return res.status(400).json({ error: 'Missing audit data payload for PDF generation.' });
    }

    const filename = `SiteSift-Audit-${auditData.domain.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const pdfStream = buildAuditPdfStream(auditData);
    pdfStream.pipe(res);
  } catch (pdfErr) {
    res.status(500).json({ error: `Failed to compile PDF: ${pdfErr.message}` });
  }
});

// CSV Export Endpoint
app.post('/api/export/csv', (req, res) => {
  try {
    const auditData = req.body;
    if (!auditData || !auditData.domain) {
      return res.status(400).json({ error: 'Missing audit data payload for CSV generation.' });
    }

    const csvContent = generateSiteSiftCsv(auditData);
    const filename = `SiteSift-Audit-${auditData.domain.replace(/[^a-z0-9]/gi, '_')}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (csvErr) {
    res.status(500).json({ error: `Failed to compile CSV: ${csvErr.message}` });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SiteSift Antigravity Orchestrator] API live on http://localhost:${PORT}`);
  });
}

module.exports = app;
