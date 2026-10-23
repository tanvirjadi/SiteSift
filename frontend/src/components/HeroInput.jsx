import React from 'react';
import { Search, Globe, ArrowRight, Loader2 } from 'lucide-react';

export default function HeroInput({
  urlInput,
  setUrlInput,
  onAnalyze,
  onQuickSelect,
  loading
}) {
  const quickPicks = [
    { label: 'Sample SaaS', value: 'demo' },
    { label: 'stripe.com', value: 'https://stripe.com' },
    { label: 'linear.app', value: 'https://linear.app' },
    { label: 'gumroad.com', value: 'https://gumroad.com' }
  ];

  return (
    <section className="hero-audit-section">
      <div className="hero-kicker">
        <span>Dual-Agent Conversion Intelligence</span>
      </div>

      <h1 className="hero-headline">
        Identify the friction <br />
        costing your website customers.
      </h1>

      <p className="hero-subhead">
        Deep multi-page crawl paired with dual-agent CRO analysis. Discover why visitors bounce before purchasing.
      </p>

      <div className="search-dossier-bar">
        <div className="input-affix">
          <Globe size={18} />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="example.com or https://company.com"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && onAnalyze()}
          disabled={loading}
        />
        <button
          type="button"
          className="btn-submit-audit"
          onClick={() => onAnalyze()}
          disabled={loading || !urlInput.trim()}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin-icon" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <span>Run Audit</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <div className="quick-pick-tray">
        <span className="tray-label">Quick samples:</span>
        {quickPicks.map((item) => (
          <button
            key={item.label}
            type="button"
            className="btn-tray-chip"
            onClick={() => onQuickSelect(item.value)}
            disabled={loading}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
