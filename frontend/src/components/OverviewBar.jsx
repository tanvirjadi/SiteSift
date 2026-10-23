import React from 'react';
import { Download, Copy, Check, ExternalLink, AlertOctagon } from 'lucide-react';

export default function OverviewBar({
  analysisData,
  onDownloadCsv,
  onCopySummary,
  copiedSummary
}) {
  const audit = analysisData?.auditResult || {};
  const score = audit.siteHealthScore ?? 70;
  const criticalCount = (audit.weaknesses || []).filter((w) => w.severity?.toUpperCase() === 'CRITICAL').length;
  const risk = audit.revenueRiskLevel || 'Medium';

  const getScoreColor = (num) => {
    if (num >= 80) return '#10b981';
    if (num >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <section className="executive-hud-card">
      <div className="hud-metric-column score-column">
        <div className="score-ring-wrap">
          <div
            className="score-ring-border"
            style={{
              borderColor: getScoreColor(score)
            }}
          >
            <span className="score-val" style={{ color: getScoreColor(score) }}>
              {score}
            </span>
            <span className="score-denom">/100</span>
          </div>
        </div>
        <div className="score-meta">
          <span className="hud-kicker">CONVERSION HEALTH</span>
          <span className="hud-desc">Composite CRO & UX Score</span>
        </div>
      </div>

      <div className="hud-data-divider" />

      <div className="hud-metric-column">
        <span className="hud-kicker">REVENUE RISK</span>
        <div className="risk-status-row">
          <span className={`risk-pill risk-${risk.toLowerCase()}`}>
            <AlertOctagon size={13} />
            {risk} Risk
          </span>
        </div>
        <span className="hud-subdesc">Customer Drop-off Potential</span>
      </div>

      <div className="hud-data-divider" />

      <div className="hud-metric-column">
        <span className="hud-kicker">CRITICAL BOTTLENECKS</span>
        <div className="critical-metric-row">
          <span className="critical-number">{criticalCount}</span>
          <span className="critical-total">/ {(audit.weaknesses || []).length} Total Issues</span>
        </div>
        <span className="hud-subdesc">Require Immediate Remedy</span>
      </div>

      <div className="hud-data-divider" />

      <div className="hud-metric-column">
        <span className="hud-kicker">AUDITED TARGET</span>
        <a
          href={analysisData.targetUrl}
          target="_blank"
          rel="noreferrer"
          className="target-link-row"
        >
          <span className="domain-text">{analysisData.domain}</span>
          <ExternalLink size={13} />
        </a>
        <span className="hud-subdesc">
          {analysisData.crawlResult?.pagesCount || 1} pages • {analysisData.crawlResult?.primaryPage?.responseTimeMs || 300}ms
        </span>
      </div>

      <div className="hud-actions-column">
        <button
          type="button"
          className="btn-primary-action"
          onClick={onDownloadCsv}
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          className="btn-secondary-action"
          onClick={onCopySummary}
        >
          {copiedSummary ? <Check size={14} className="icon-success" /> : <Copy size={14} />}
          <span>{copiedSummary ? 'Copied' : 'Copy Briefing'}</span>
        </button>
      </div>
    </section>
  );
}
