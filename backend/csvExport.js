/**
 * Generates an executive, client-ready CSV spreadsheet audit
 */
function generateSiteSiftCsv(auditPayload) {
  const { targetUrl, domain, analyzedAt, auditResult, extractedBlueprint, speedMetrics } = auditPayload;

  const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

  const rows = [];
  rows.push(['SiteSift Professional CRO Audit Report']);
  rows.push(['Domain', escapeCsv(domain)]);
  rows.push(['Target URL', escapeCsv(targetUrl)]);
  rows.push(['Audit Timestamp', escapeCsv(analyzedAt)]);
  rows.push(['Business Vertical', escapeCsv(extractedBlueprint?.vertical || 'General Business')]);
  rows.push(['Conversion Health Score', auditResult?.siteHealthScore || 'N/A']);
  rows.push(['Revenue Risk Level', escapeCsv(auditResult?.revenueRiskLevel || 'Moderate')]);
  rows.push(['PageSpeed Performance Score', speedMetrics?.performanceScore ? `${speedMetrics.performanceScore}/100` : 'Calibrated']);
  rows.push(['LCP (Largest Contentful Paint)', escapeCsv(speedMetrics?.lcp || 'N/A')]);
  rows.push(['CLS (Cumulative Layout Shift)', escapeCsv(speedMetrics?.cls || 'N/A')]);
  rows.push(['Estimated Monthly Bounce Drag', escapeCsv(auditResult?.estimatedMonthlyBounceCost || 'N/A')]);
  rows.push([]);

  // Executive Summary
  rows.push(['--- EXECUTIVE BRIEFING ---']);
  rows.push([escapeCsv(auditResult?.executiveSummary || '')]);
  rows.push([]);

  // Top Quick Wins
  rows.push(['--- TOP QUICK WINS ---']);
  rows.push(['Title', 'Impact', 'Action Required']);
  (auditResult?.topQuickWins || []).forEach((win) => {
    rows.push([escapeCsv(win.title), escapeCsv(win.impact), escapeCsv(win.action)]);
  });
  rows.push([]);

  // Critical Flaws
  rows.push(['--- CRITICAL FLAWS (IMMEDIATE REVENUE LEAKS) ---']);
  rows.push(['ID', 'Heuristic / Principle', 'Issue', 'Drop-Off Location', 'Conversion Impact', 'Actionable Fix', 'Effort']);
  const criticals = auditResult?.criticalFlaws || (auditResult?.weaknesses || []).filter((w) => w.severity === 'Critical');
  criticals.forEach((c) => {
    rows.push([
      escapeCsv(c.id),
      escapeCsv(c.heuristic || c.category || 'Visual Hierarchy & Clarity'),
      escapeCsv(c.issue),
      escapeCsv(c.location || c.dropoffLocation),
      escapeCsv(c.conversionImpact || c.customerCost),
      escapeCsv(c.actionableFix),
      escapeCsv(c.effort || 'Quick Win (<1h)')
    ]);
  });
  rows.push([]);

  // Optimization Opportunities
  rows.push(['--- OPTIMIZATION OPPORTUNITIES ---']);
  rows.push(['ID', 'Issue', 'Location', 'Projected Uplift', 'Actionable Fix', 'Effort']);
  const optimizations = auditResult?.optimizationOpportunities || (auditResult?.weaknesses || []).filter((w) => w.severity !== 'Critical');
  optimizations.forEach((opt) => {
    rows.push([
      escapeCsv(opt.id),
      escapeCsv(opt.issue),
      escapeCsv(opt.location || opt.dropoffLocation || 'General UX'),
      escapeCsv(opt.conversionImpact || opt.customerCost || 'Secondary uplift'),
      escapeCsv(opt.actionableFix),
      escapeCsv(opt.effort || 'Moderate (1-3h)')
    ]);
  });
  rows.push([]);

  // Passed Elements / Strengths
  rows.push(['--- PASSED ELEMENTS (STRENGTHS TO PRESERVE) ---']);
  const passed = auditResult?.passedElements || auditResult?.strengths || [];
  passed.forEach((item) => {
    rows.push([escapeCsv(item)]);
  });

  return rows.map((r) => r.join(',')).join('\n');
}

module.exports = {
  generateSiteSiftCsv,
};
