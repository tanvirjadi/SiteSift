function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function formatRow(cells) {
  return cells.map(escapeCsvCell).join(',');
}

function generateSiteSiftCsv(analysisData) {
  const { crawlResult, extractedBlueprint, auditResult } = analysisData;
  const primaryPage = crawlResult?.primaryPage || {};
  const weaknesses = auditResult?.weaknesses || [];
  const topWins = auditResult?.topQuickWins || [];

  const lines = [];

  lines.push(formatRow(['SITESIFT AUDIT REPORT & WEBSITE REVENUE LEAK ANALYSIS']));
  lines.push(formatRow(['Generated At', new Date().toISOString()]));
  lines.push(formatRow(['Target URL', crawlResult?.primaryUrl || '']));
  lines.push(formatRow(['Domain', crawlResult?.domain || '']));
  lines.push(formatRow(['Site Health Score', `${auditResult?.siteHealthScore || 'N/A'}/100`]));
  lines.push(formatRow(['Revenue Risk Level', auditResult?.revenueRiskLevel || 'N/A']));
  lines.push(formatRow(['Estimated Bounce Cost', auditResult?.estimatedMonthlyBounceCost || 'N/A']));
  lines.push(formatRow(['Executive Summary', auditResult?.executiveSummary || '']));
  lines.push('');

  lines.push(formatRow(['--- IDENTIFIED WEAKNESSES COSTING THE BUSINESS CUSTOMERS ---']));
  lines.push(formatRow([
    'ID',
    'Category',
    'Severity',
    'Issue',
    'Drop-Off Location',
    'Customer Psychology & Revenue Cost',
    'Recommended Actionable Fix',
    'Effort Level'
  ]));

  weaknesses.forEach((w) => {
    lines.push(formatRow([
      w.id || '',
      w.category || '',
      w.severity || '',
      w.issue || '',
      w.dropoffLocation || '',
      w.customerCost || '',
      w.actionableFix || '',
      w.effort || ''
    ]));
  });

  lines.push('');

  lines.push(formatRow(['--- TOP PRIORITY QUICK WINS (HIGHEST LEVERAGE) ---']));
  lines.push(formatRow(['#', 'Priority Fix', 'Expected Customer Impact', 'Action Required']));
  topWins.forEach((win, idx) => {
    lines.push(formatRow([
      idx + 1,
      win.title || '',
      win.impact || '',
      win.action || ''
    ]));
  });

  lines.push('');

  lines.push(formatRow(['--- EXTRACTED BUSINESS & CONTENT BLUEPRINT (AGENT 1) ---']));
  lines.push(formatRow(['Business Name', extractedBlueprint?.businessName || '']));
  lines.push(formatRow(['Tagline', extractedBlueprint?.tagline || '']));
  lines.push(formatRow(['Value Proposition', extractedBlueprint?.valueProposition || '']));
  lines.push(formatRow(['Target Audience', JSON.stringify(extractedBlueprint?.targetAudience || {})]));
  lines.push(formatRow(['Primary Conversion Goal', extractedBlueprint?.primaryConversionGoal || '']));
  lines.push(formatRow(['Core Offerings', (extractedBlueprint?.coreOfferings || []).join('; ')]));
  lines.push(formatRow(['Pricing Model', extractedBlueprint?.pricingModel || '']));
  lines.push(formatRow(['Trust Signals', (extractedBlueprint?.trustSignalsDetected || []).join('; ')]));
  lines.push(formatRow(['Content Tone', extractedBlueprint?.contentToneAndClarity || '']));

  lines.push('');

  lines.push(formatRow(['--- TECHNICAL & SEO AUDIT SIGNALS ---']));
  lines.push(formatRow([
    'Page URL',
    'HTTP Status',
    'Response Time (ms)',
    'HTTPS Secure',
    'Page Title',
    'Meta Description',
    'Word Count',
    'Reading Time (min)',
    'H1 Count',
    'H1 Headings',
    'H2 Count',
    'Total Images',
    'Missing Alt Tags',
    'Forms Found',
    'Internal Links',
    'External Links',
    'CTAs Detected'
  ]));

  (crawlResult?.crawledPages || [primaryPage]).forEach((page) => {
    lines.push(formatRow([
      page.url || '',
      page.statusCode || 200,
      page.responseTimeMs || 0,
      page.isHttps ? 'Yes' : 'No',
      page.metadata?.title || '',
      page.metadata?.description || '',
      page.metrics?.wordCount || 0,
      page.metrics?.readingTimeMinutes || 1,
      page.metrics?.h1Count || 0,
      (page.headings?.h1 || []).join(' | '),
      page.metrics?.h2Count || 0,
      page.metrics?.totalImages || 0,
      page.metrics?.missingAltCount || 0,
      page.metrics?.formsCount || 0,
      page.metrics?.internalLinksCount || 0,
      page.metrics?.externalLinksCount || 0,
      (page.ctas || []).join('; ')
    ]));
  });

  return lines.join('\r\n');
}

module.exports = {
  generateSiteSiftCsv,
};
