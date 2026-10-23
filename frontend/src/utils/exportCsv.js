export function exportToCsv(analysisData) {
  if (!analysisData) return;

  const primaryPage = analysisData.crawlResult?.primaryPage || {};
  const audit = analysisData.auditResult || {};
  const blueprint = analysisData.extractedBlueprint || {};
  const weaknesses = audit.weaknesses || [];
  const topWins = audit.topQuickWins || [];

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const rows = [];
  rows.push(['SITESIFT AUDIT REPORT']);
  rows.push(['Generated At', new Date().toISOString()]);
  rows.push(['Target URL', analysisData.targetUrl || '']);
  rows.push(['Domain', analysisData.domain || '']);
  rows.push(['Site Health Score', `${audit.siteHealthScore || 'N/A'}/100`]);
  rows.push(['Revenue Risk Level', audit.revenueRiskLevel || 'N/A']);
  rows.push(['Estimated Bounce Cost', audit.estimatedMonthlyBounceCost || 'N/A']);
  rows.push(['Executive Summary', audit.executiveSummary || '']);
  rows.push([]);

  rows.push(['--- CUSTOMER WEAKNESSES ---']);
  rows.push(['ID', 'Category', 'Severity', 'Issue', 'Drop-Off Location', 'Customer Drop-off Cost', 'Actionable Fix', 'Effort']);
  weaknesses.forEach((w) => {
    rows.push([w.id, w.category, w.severity, w.issue, w.dropoffLocation, w.customerCost, w.actionableFix, w.effort]);
  });
  rows.push([]);

  rows.push(['--- PRIORITY QUICK WINS ---']);
  rows.push(['#', 'Title', 'Impact', 'Action Required']);
  topWins.forEach((win, idx) => {
    rows.push([idx + 1, win.title, win.impact, win.action]);
  });
  rows.push([]);

  rows.push(['--- AGENT 1 EXTRACTED BLUEPRINT ---']);
  rows.push(['Business Name', blueprint.businessName || '']);
  rows.push(['Value Proposition', blueprint.valueProposition || '']);
  rows.push(['Primary Conversion Goal', blueprint.primaryConversionGoal || '']);
  rows.push(['Core Offerings', (blueprint.coreOfferings || []).join('; ')]);
  rows.push(['Pricing Model', blueprint.pricingModel || '']);
  rows.push([]);

  rows.push(['--- TECHNICAL & SEO SIGNALS ---']);
  rows.push(['Page Title', primaryPage.metadata?.title || '']);
  rows.push(['Meta Description', primaryPage.metadata?.description || '']);
  rows.push(['Status Code', primaryPage.statusCode || 200]);
  rows.push(['Response Time (ms)', primaryPage.responseTimeMs || 0]);
  rows.push(['Word Count', primaryPage.metrics?.wordCount || 0]);
  rows.push(['Missing Alt Count', primaryPage.metrics?.missingAltCount || 0]);
  rows.push(['Total Forms', primaryPage.metrics?.formsCount || 0]);

  const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCell).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `sitesift-${analysisData.domain || 'audit'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
