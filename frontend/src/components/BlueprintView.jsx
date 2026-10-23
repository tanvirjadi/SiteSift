import React from 'react';
import { Target, Compass, Layers, ShieldCheck } from 'lucide-react';

export default function BlueprintView({ blueprint, crawlResult }) {
  const data = blueprint || {};
  const offerings = data.coreOfferings || [];
  const trustSignals = data.trustSignalsDetected || [];
  const ctas = crawlResult?.primaryPage?.ctas || [];

  return (
    <div className="blueprint-cards-grid">
      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <Compass size={16} />
            <span>Positioning & Core Offer</span>
          </div>
        </div>

        <div className="blueprint-detail-group">
          <div className="detail-field">
            <span className="field-label">BUSINESS ENTITY</span>
            <div className="field-value-strong">{data.businessName || 'Not Identified'}</div>
          </div>

          {data.tagline && (
            <div className="detail-field">
              <span className="field-label">IDENTIFIED TAGLINE</span>
              <div className="field-value-italic">"{data.tagline}"</div>
            </div>
          )}

          <div className="detail-field">
            <span className="field-label">VALUE PROPOSITION</span>
            <div className="field-value-text">{data.valueProposition}</div>
          </div>

          <div className="detail-field">
            <span className="field-label">CONTENT TONE & CLARITY</span>
            <div className="field-value-subtle">{data.contentToneAndClarity}</div>
          </div>
        </div>
      </article>

      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <Target size={16} />
            <span>Customer Profile & Funnel</span>
          </div>
        </div>

        <div className="blueprint-detail-group">
          <div className="detail-field">
            <span className="field-label">IDEAL CUSTOMER PROFILE (ICP)</span>
            <div className="field-value-text">
              {data.targetAudience?.profile || JSON.stringify(data.targetAudience)}
            </div>
          </div>

          <div className="detail-field">
            <span className="field-label">MARKET SEGMENT</span>
            <div className="field-badge-line">
              <span className="clean-tag">
                {data.targetAudience?.marketSegment || 'General'}
              </span>
            </div>
          </div>

          <div className="detail-field">
            <span className="field-label">PRIMARY CONVERSION GOAL</span>
            <div className="field-value-strong">{data.primaryConversionGoal}</div>
          </div>

          <div className="detail-field">
            <span className="field-label">PRICING ARCHITECTURE</span>
            <div className="field-value-subtle">{data.pricingModel}</div>
          </div>
        </div>
      </article>

      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <Layers size={16} />
            <span>Core Offerings & Features</span>
          </div>
        </div>

        <div className="blueprint-bullet-stack">
          {offerings.map((item, idx) => (
            <div key={idx} className="bullet-row">
              <span className="bullet-indicator" />
              <span className="bullet-text">{item}</span>
            </div>
          ))}
          {offerings.length === 0 && (
            <span className="empty-subtext">No explicit offerings detected.</span>
          )}
        </div>
      </article>

      <article className="dossier-card">
        <div className="dossier-card-header">
          <div className="card-header-title">
            <ShieldCheck size={16} />
            <span>Trust Proof & CTA Inventory</span>
          </div>
        </div>

        <div className="blueprint-detail-group">
          <div className="detail-field">
            <span className="field-label">TRUST & AUTHORITY PROOF</span>
            <div className="blueprint-bullet-stack compact">
              {trustSignals.map((item, idx) => (
                <div key={idx} className="bullet-row">
                  <span className="bullet-indicator green" />
                  <span className="bullet-text">{item}</span>
                </div>
              ))}
              {trustSignals.length === 0 && (
                <span className="empty-subtext">No trust badges or proofs found.</span>
              )}
            </div>
          </div>

          <div className="detail-field">
            <span className="field-label">DETECTED CALLS TO ACTION</span>
            <div className="chips-flow-wrap">
              {ctas.map((cta, idx) => (
                <span key={idx} className="clean-tag">
                  {cta}
                </span>
              ))}
              {ctas.length === 0 && (
                <span className="empty-subtext">No explicit CTAs detected.</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
