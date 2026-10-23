import React from 'react';
import { Clock, Image as ImageIcon, Link2, ShieldAlert, Zap, Activity, Cpu } from 'lucide-react';

export default function TechnicalAudit({ primaryPage, targetUrl, speedMetrics, systemDiagnostics }) {
  const page = primaryPage || {};
  const meta = page.metadata || {};
  const metrics = page.metrics || {};
  const headings = page.headings || { h1: [], h2: [] };
  const speed = speedMetrics || {};
  const diag = systemDiagnostics || page.system_diagnostics || {};

  return (
    <div className="technical-dossier-layout">
      {/* Core Web Vitals & Technical Speed HUD */}
      {speed.performanceScore !== undefined && (
        <div className="dossier-card" style={{ marginBottom: 20, borderLeft: '3px solid #38bdf8' }}>
          <div className="dossier-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} style={{ color: '#38bdf8' }} />
              Google PageSpeed & Core Web Vitals Insights
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {speed.source || 'Performance Engine'}
            </span>
          </div>

          <div className="tech-stat-strip" style={{ marginTop: 14 }}>
            <div className="stat-strip-box">
              <div className="stat-box-icon" style={{ background: speed.performanceScore >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }}>
                <Activity size={16} color={speed.performanceScore >= 80 ? '#10b981' : '#f59e0b'} />
              </div>
              <div className="stat-box-data">
                <span className="stat-num" style={{ color: speed.performanceScore >= 80 ? '#10b981' : '#f59e0b' }}>
                  {speed.performanceScore}/100
                </span>
                <span className="stat-desc">PageSpeed Score ({speed.grade || 'Calibrated'})</span>
              </div>
            </div>

            <div className="stat-strip-box">
              <div className="stat-box-icon">
                <Clock size={16} />
              </div>
              <div className="stat-box-data">
                <span className="stat-num">{speed.lcp || 'N/A'}</span>
                <span className="stat-desc">LCP (Contentful Paint)</span>
              </div>
            </div>

            <div className="stat-strip-box">
              <div className="stat-box-icon">
                <Cpu size={16} />
              </div>
              <div className="stat-box-data">
                <span className="stat-num">{speed.cls || '0.00'}</span>
                <span className="stat-desc">CLS (Layout Shift)</span>
              </div>
            </div>

            <div className="stat-strip-box">
              <div className="stat-box-icon">
                <Zap size={16} />
              </div>
              <div className="stat-box-data">
                <span className="stat-num">{speed.fcp || 'N/A'}</span>
                <span className="stat-desc">FCP (First Paint)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zero-G Pipeline & Page Metrics Strip */}
      <div className="tech-stat-strip">
        <div className="stat-strip-box">
          <div className="stat-box-icon">
            <Clock size={16} />
          </div>
          <div className="stat-box-data">
            <span className="stat-num">{page.responseTimeMs || 0} ms</span>
            <span className="stat-desc">Server Latency</span>
          </div>
        </div>

        <div className="stat-strip-box">
          <div className="stat-box-icon">
            <ImageIcon size={16} />
          </div>
          <div className="stat-box-data">
            <span className="stat-num">
              {metrics.missingAltCount || 0}
              <span className="stat-sub"> / {metrics.totalImages || 0}</span>
            </span>
            <span className="stat-desc">Missing Alt Tags</span>
          </div>
        </div>

        <div className="stat-strip-box">
          <div className="stat-box-icon">
            <Link2 size={16} />
          </div>
          <div className="stat-box-data">
            <span className="stat-num">{metrics.internalLinksCount || 0}</span>
            <span className="stat-desc">Internal Links</span>
          </div>
        </div>

        <div className="stat-strip-box">
          <div className="stat-box-icon">
            <ShieldAlert size={16} />
          </div>
          <div className="stat-box-data">
            <span className="stat-num">
              {diag.payload_size_kb ? `${diag.payload_size_kb} KB` : `${headings.h1?.length || 0} H1`}
            </span>
            <span className="stat-desc">
              {diag.payload_size_kb ? 'Clean Context Budget' : 'H1 Tag Count'}
            </span>
          </div>
        </div>
      </div>

      <div className="serp-preview-card">
        <span className="serp-preview-label">SERP SNIPPET SIMULATION (GOOGLE DESKTOP)</span>
        <div className="google-serp-box">
          <span className="serp-url">{targetUrl}</span>
          <h4 className="serp-title">{meta.title || 'No Title Tag Detected'}</h4>
          <p className="serp-snippet">{meta.description || 'No Meta Description Tag Found.'}</p>
        </div>
      </div>

      <div className="dossier-card">
        <div className="dossier-card-header">
          <span className="card-header-title">Extracted Metadata Inspector</span>
        </div>

        <table className="clean-meta-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Extracted Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="meta-cell-prop">Title</td>
              <td className="meta-cell-val">{meta.title || '—'}</td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Meta Description</td>
              <td className="meta-cell-val">{meta.description || '—'}</td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Canonical URL</td>
              <td className="meta-cell-val">{meta.canonical || '—'}</td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Robots Tag</td>
              <td className="meta-cell-val">{meta.robots || 'index, follow (default)'}</td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Heading 1 (H1)</td>
              <td className="meta-cell-val">
                {headings.h1?.length ? (
                  headings.h1.map((h, i) => <div key={i}>• {h}</div>)
                ) : (
                  <span className="text-warning">Missing H1 Heading</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Open Graph Title</td>
              <td className="meta-cell-val">{page.openGraph?.title || 'Not Configured'}</td>
            </tr>
            <tr>
              <td className="meta-cell-prop">Twitter Card</td>
              <td className="meta-cell-val">{page.twitter?.card || 'Not Configured'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
