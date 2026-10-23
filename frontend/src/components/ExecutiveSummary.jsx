import React from 'react';
import { FileText, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ExecutiveSummary({ auditResult }) {
  const audit = auditResult || {};
  const topWins = audit.topQuickWins || [];
  const strengths = audit.strengths || [];

  return (
    <div className="executive-dossier-layout">
      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <FileText size={16} />
            <span>Executive CRO Briefing</span>
          </div>
          <span className="risk-indicator-pill">
            Risk: {audit.revenueRiskLevel || 'Medium'}
          </span>
        </div>

        <div className="briefing-letter-text">
          {audit.executiveSummary}
        </div>

        {audit.estimatedMonthlyBounceCost && (
          <div className="bounce-impact-banner">
            <TrendingDown size={16} />
            <span>{audit.estimatedMonthlyBounceCost}</span>
          </div>
        )}
      </article>

      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <Sparkles size={16} />
            <span>High-Leverage Quick Wins</span>
          </div>
          <span className="count-subtag">{topWins.length} Action Items</span>
        </div>

        <div className="quick-wins-stack">
          {topWins.map((win, idx) => (
            <div key={idx} className="quick-win-row">
              <div className="win-priority-col">
                <span className="priority-label">#{idx + 1}</span>
              </div>
              <div className="win-content-col">
                <h4 className="win-headline">{win.title}</h4>
                <p className="win-impact-text">{win.impact}</p>
                <div className="win-remedy-box">
                  <span className="action-tag">ACTION</span>
                  <span className="action-text">{win.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      {strengths.length > 0 && (
        <article className="dossier-card">
          <div className="dossier-card-header">
            <div className="card-header-title">
              <CheckCircle2 size={16} />
              <span>Current Strengths to Preserve</span>
            </div>
          </div>

          <div className="strengths-list-grid">
            {strengths.map((str, idx) => (
              <div key={idx} className="strength-item-cell">
                <span className="strength-bullet">•</span>
                <span className="strength-text">{str}</span>
              </div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
