const PDFDocument = require('pdfkit');

/**
 * Builds a streamable professional PDF audit dossier for SiteSift
 */
function buildAuditPdfStream(auditData) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true,
  });

  const domain = auditData.domain || 'Target Website';
  const targetUrl = auditData.targetUrl || '';
  const healthScore = auditData.auditResult?.siteHealthScore || 0;
  const riskLevel = auditData.auditResult?.revenueRiskLevel || 'Moderate';
  const vertical = auditData.extractedBlueprint?.vertical || 'General Business';
  const speedScore = auditData.speedMetrics?.performanceScore;

  // 1. Premium Header Banner
  doc.rect(0, 0, doc.page.width, 95).fill('#0f172a');
  doc.fillColor('#38bdf8').fontSize(22).font('Helvetica-Bold').text('SITESIFT', 40, 28);
  doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text('Enterprise Conversion Rate & Usability Audit', 40, 54);

  doc.fillColor('#ffffff').fontSize(9).text(`Audit Date: ${new Date().toLocaleDateString()}`, 380, 32, { align: 'right' });
  doc.fillColor('#38bdf8').fontSize(9).text(domain, 380, 48, { align: 'right' });

  // 2. Score Cards Bar
  const startY = 115;
  doc.roundedRect(40, startY, 155, 65, 6).fill('#f8fafc').stroke('#e2e8f0');
  doc.roundedRect(205, startY, 155, 65, 6).fill('#f8fafc').stroke('#e2e8f0');
  doc.roundedRect(370, startY, 185, 65, 6).fill('#f8fafc').stroke('#e2e8f0');

  // Card 1: Health Score
  doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('CONVERSION HEALTH', 52, startY + 12);
  const scoreColor = healthScore >= 75 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444';
  doc.fillColor(scoreColor).fontSize(20).text(`${healthScore}/100`, 52, startY + 28);

  // Card 2: Risk Level
  doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('REVENUE RISK LEVEL', 217, startY + 12);
  const riskColor = riskLevel === 'Critical' ? '#ef4444' : riskLevel === 'High' ? '#f97316' : '#10b981';
  doc.fillColor(riskColor).fontSize(18).text(riskLevel, 217, startY + 28);

  // Card 3: Vertical & Speed
  doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('NICHE & CORE WEB VITALS', 382, startY + 12);
  const speedStr = speedScore !== undefined && speedScore !== null ? `Speed: ${speedScore}/100` : 'Speed: Calibrated';
  doc.fillColor('#0284c7').fontSize(11).text(`${vertical}`, 382, startY + 28);
  doc.fillColor('#475569').fontSize(9).font('Helvetica').text(`${speedStr} (LCP: ${auditData.speedMetrics?.lcp || 'Good'})`, 382, startY + 44);

  // 3. Executive Briefing
  let currentY = startY + 85;
  doc.fillColor('#0f172a').fontSize(13).font('Helvetica-Bold').text('Executive Briefing', 40, currentY);
  currentY += 18;

  const summary = auditData.auditResult?.executiveSummary || 'Audit analysis completed successfully.';
  doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(summary, 40, currentY, { width: 515, lineGap: 3 });
  currentY = doc.y + 14;

  // 4. Quick Wins Action Plan
  if (auditData.auditResult?.topQuickWins?.length) {
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Top Priority Action Items (Quick Wins)', 40, currentY);
    currentY += 16;

    auditData.auditResult.topQuickWins.slice(0, 3).forEach((win, idx) => {
      doc.fillColor('#0284c7').fontSize(9.5).font('Helvetica-Bold').text(`${idx + 1}. ${win.title}`, 45, currentY);
      currentY = doc.y + 2;
      doc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(`Impact: ${win.impact}`, 55, currentY, { width: 500 });
      currentY = doc.y + 2;
      doc.fillColor('#334155').fontSize(8.5).text(`Action: ${win.action}`, 55, currentY, { width: 500 });
      currentY = doc.y + 8;
    });
  }

  // 5. Critical Flaws Section
  currentY = doc.y + 10;
  if (currentY > doc.page.height - 180) {
    doc.addPage();
    currentY = 40;
  }

  doc.fillColor('#b91c1c').fontSize(12).font('Helvetica-Bold').text('Critical Conversion Flaws (Immediate Leaks)', 40, currentY);
  currentY += 16;

  const flaws = auditData.auditResult?.criticalFlaws || (auditData.auditResult?.weaknesses || []).filter((w) => w.severity === 'Critical');
  if (flaws.length === 0) {
    doc.fillColor('#10b981').fontSize(9).font('Helvetica').text('No critical conversion blockers detected.', 45, currentY);
    currentY += 14;
  } else {
    flaws.slice(0, 4).forEach((flaw, idx) => {
      if (currentY > doc.page.height - 110) {
        doc.addPage();
        currentY = 40;
      }
      doc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(`${idx + 1}. ${flaw.issue}`, 45, currentY);
      currentY = doc.y + 2;
      doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').text(`Location: ${flaw.location || flaw.dropoffLocation || 'Above the Fold'} | Effort: ${flaw.effort || 'Quick Win'}`, 55, currentY);
      currentY = doc.y + 2;
      doc.fillColor('#475569').fontSize(8.5).text(`Cost/Impact: ${flaw.conversionImpact || flaw.customerCost}`, 55, currentY, { width: 490 });
      currentY = doc.y + 2;
      doc.fillColor('#0369a1').fontSize(8.5).text(`Fix: ${flaw.actionableFix}`, 55, currentY, { width: 490 });
      currentY = doc.y + 8;
    });
  }

  // Footer on all pages
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(7.5).fillColor('#94a3b8').text(
      `SiteSift Resilient Engine • Target: ${targetUrl} • Page ${i + 1} of ${range.count}`,
      40,
      doc.page.height - 25,
      { align: 'center', width: 515 }
    );
  }

  doc.end();
  return doc;
}

module.exports = {
  buildAuditPdfStream,
};
