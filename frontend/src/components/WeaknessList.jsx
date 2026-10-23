import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, MapPin, Wrench } from 'lucide-react';

export default function WeaknessList({ weaknesses }) {
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const filterOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const filtered = (weaknesses || []).filter((w) => {
    if (filter === 'ALL') return true;
    return w.severity?.toUpperCase() === filter;
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="weakness-dossier-wrapper">
      <div className="weakness-controls-bar">
        <div className="segmented-filter-group">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`filter-segment-btn ${filter === opt ? 'active' : ''}`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <span className="weakness-count-summary">
          {filtered.length} diagnosed friction points
        </span>
      </div>

      <div className="weakness-items-stack">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const severityLower = (item.severity || 'low').toLowerCase();

          return (
            <article
              key={item.id}
              className={`weakness-row-card severity-${severityLower}`}
            >
              <div
                className="weakness-primary-header"
                onClick={() => toggleExpand(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand(item.id)}
              >
                <div className="header-meta-cluster">
                  <span className={`pill-badge badge-${severityLower}`}>
                    {item.severity}
                  </span>
                  <span className="pill-category">{item.category}</span>
                  {item.dropoffLocation && (
                    <span className="pill-location">
                      <MapPin size={12} />
                      {item.dropoffLocation}
                    </span>
                  )}
                  {item.effort && (
                    <span className="pill-effort">
                      <Wrench size={11} />
                      {item.effort}
                    </span>
                  )}
                </div>

                <div className="header-title-row">
                  <h3 className="weakness-headline">{item.issue}</h3>
                  <button
                    type="button"
                    className="btn-toggle-expand"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              <div className={`weakness-expandable-content ${isExpanded ? 'open' : 'default-open'}`}>
                <div className="dual-analysis-grid">
                  <div className="analysis-pane pane-cost">
                    <div className="pane-title">
                      <AlertCircle size={14} />
                      <span>Why This Costs Paying Customers</span>
                    </div>
                    <p className="pane-body">{item.customerCost}</p>
                  </div>

                  <div className="analysis-pane pane-fix">
                    <div className="pane-title">
                      <CheckCircle2 size={14} />
                      <span>Recommended Actionable Remedy</span>
                    </div>
                    <p className="pane-body">{item.actionableFix}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state-notice">
            No weaknesses found for severity: {filter}
          </div>
        )}
      </div>
    </div>
  );
}
