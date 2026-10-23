import React from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onLoadSample, loading }) {
  return (
    <header className="site-header">
      <div className="header-brand">
        <div className="brand-mark">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <span className="brand-name">SiteSift</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={onLoadSample}
          disabled={loading}
        >
          <span>Demo Audit</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </header>
  );
}
