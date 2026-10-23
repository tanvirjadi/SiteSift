import React from 'react';
import { Download, Copy, Check, ExternalLink, AlertOctagon, FileText, Activity } from 'lucide-react';

export default function OverviewBar({
  analysisData,
  onDownloadCsv,
  onDownloadPdf,
  onCopySummary,
  copiedSummary,
  isDownloadingPdf
}) {
  const audit = analysisData?.auditResult || {};
  const score = audit.siteHealthScore ?? 70;
  const criticalCount = (audit.criticalFlaws || (audit.weaknesses || []).filter((w) => w.severity?.toUpperCase() === 'CRITICAL')).length;
  const risk = audit.revenueRiskLevel || 'Medium';
  const vertical = analysisData?.extractedBlueprint?.vertical || 'General';
  const speed = analysisData?.speedMetrics;

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
          <span className="hud-desc">Nielsen & CRO Composite</span>
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
          <span className="critical-total">/ {(audit.weaknesses || []).length} Friction Points</span>
        </div>
        <span className="hud-subdesc">Immediate Sales Blockers</span>
      </div>

      <div className="hud-data-divider" />

      <div className="hud-metric-column">
        <span className="hud-kicker">BUSINESS VERTICAL</span>
        <div className="target-link-row">
          <span className="domain-text" style={{ fontWeight: 600, color: '#38bdf8' }}>{vertical}</span>
        </div>
        <span className="hud-subdesc">
          {speed?.performanceScore ? `Speed Score: ${speed.performanceScore}/100` : `${analysisData.domain}`}
        </span>
      </div>

      <div className="hud-actions-column">
        <button
          type="button"
          className="btn-primary-action"
          onClick={onDownloadPdf}
          disabled={isDownloadingPdf}
          title="Download branded client PDF audit report"
        >
          <FileText size={15} />
          <span>{isDownloadingPdf ? 'Compiling PDF...' : 'Export PDF'}</span>
        </button>

        <button
          type="button"
          className="btn-secondary-action"
          onClick={onDownloadCsv}
          title="Export CSV spreadsheet for outreach"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          className="btn-secondary-action"
          onClick={onCopySummary}
          title="Copy executive brief to clipboard"
        >
          {copiedSummary ? <Check size={14} className="icon-success" /> : <Copy size={14} />}
          <span>{copiedSummary ? 'Copied' : 'Briefing'}</span>
        </button>
      </div>
    </section>
  );
}
