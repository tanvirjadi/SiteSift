import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

export default function CrawledPagesView({ pages }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const togglePage = (idx) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="crawled-pages-dossier">
      {(pages || []).map((page, idx) => {
        const isExpanded = expandedIndex === idx;

        return (
          <article key={idx} className="crawled-page-block">
            <div
              className="crawled-page-header"
              onClick={() => togglePage(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && togglePage(idx)}
            >
              <div className="page-header-info">
                <span className="page-badge">Page #{idx + 1}</span>
                <span className="page-url-text">{page.url}</span>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="page-external-icon"
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="page-header-meta">
                <span className="page-status-pill">HTTP {page.statusCode || 200}</span>
                <span className="page-time-pill">{page.responseTimeMs || 0}ms</span>
                <button type="button" className="btn-toggle-expand" aria-label="Toggle content">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="crawled-page-body">
                <div className="page-metadata-summary">
                  <div>
                    <span className="meta-label">Title:</span> {page.metadata?.title || 'None'}
                  </div>
                  <div>
                    <span className="meta-label">Description:</span> {page.metadata?.description || 'None'}
                  </div>
                  <div>
                    <span className="meta-label">Word Count:</span> {page.metrics?.wordCount || 0} words
                  </div>
                </div>

                {page.textContentSample && (
                  <div className="page-transcript-view">
                    <div className="transcript-header">
                      <FileCode size={13} />
                      <span>Extracted Content Transcript</span>
                    </div>
                    <pre className="transcript-pre">{page.textContentSample}</pre>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
