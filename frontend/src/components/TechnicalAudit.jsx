import React from 'react';
import { Clock, Image as ImageIcon, Link2, ShieldAlert } from 'lucide-react';

export default function TechnicalAudit({ primaryPage, targetUrl }) {
  const page = primaryPage || {};
  const meta = page.metadata || {};
  const metrics = page.metrics || {};
  const headings = page.headings || { h1: [], h2: [] };

  return (
    <div className="technical-dossier-layout">
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
            <span className="stat-num">{headings.h1?.length || 0}</span>
            <span className="stat-desc">H1 Tag Count</span>
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
