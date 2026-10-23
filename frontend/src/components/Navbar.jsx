import React from 'react';
import { Zap, Key, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({
  envKeyFound,
  customApiKey,
  onOpenSettings,
  onLoadSample,
  loading
}) {
  const hasKey = envKeyFound || Boolean(customApiKey && customApiKey.trim().length > 5);

  return (
    <header className="site-header">
      <div className="header-brand">
        <div className="brand-mark">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <span className="brand-name">SiteSift</span>
          <span className="brand-tag">CRO Dossier</span>
        </div>
      </div>

      <div className="header-actions">
        <div className={`key-status-indicator ${hasKey ? 'active' : 'inactive'}`}>
          <span className="indicator-pip" />
          <span className="indicator-label">
            {envKeyFound ? 'Vercel / Env Key' : customApiKey ? 'Browser Key' : 'API Key Missing'}
          </span>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={onLoadSample}
          disabled={loading}
        >
          <span>Demo Audit</span>
          <ArrowUpRight size={14} />
        </button>

        <button
          type="button"
          className="btn-action-outline"
          onClick={onOpenSettings}
        >
          <Key size={14} />
          <span>API Key</span>
        </button>
      </div>
    </header>
  );
}
