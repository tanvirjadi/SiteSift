import React from 'react';
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  customApiKey,
  setCustomApiKey,
  selectedModel,
  setSelectedModel,
  onSave,
  envKeyFound
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-layer" onClick={onClose}>
      <div className="modal-dossier-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-header">
          <div className="modal-title-cluster">
            <Key size={16} />
            <h3 className="modal-box-title">OpenRouter API Configuration</h3>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-box-body">
          <div className="environment-notice-banner">
            <div className="notice-icon-col">
              <ShieldCheck size={16} />
            </div>
            <div className="notice-text-col">
              <strong>Hosting on Vercel:</strong> Add <code>OPENROUTER_API_KEY</code> under{' '}
              <em>Vercel Project Settings &gt; Environment Variables</em>, or paste your personal key below. It stays in your browser's local storage.
            </div>
          </div>

          <div className="modal-field-block">
            <label className="modal-label" htmlFor="api-key-input">
              OpenRouter API Key (sk-or-v1-...)
            </label>
            <input
              id="api-key-input"
              type="password"
              className="modal-input"
              placeholder="sk-or-v1-..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
            />
            <div className="modal-help-row">
              <span>Need a key?</span>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="modal-inline-link"
              >
                <span>Generate key on OpenRouter</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div className="modal-field-block">
            <label className="modal-label" htmlFor="model-select-input">
              AI Model ID
            </label>
            <input
              id="model-select-input"
              type="text"
              className="modal-input"
              placeholder="e.g. google/gemini-2.5-flash"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <span className="modal-help-sub">
              Recommended: <code>google/gemini-2.5-flash</code>, <code>deepseek/deepseek-chat</code>, or <code>anthropic/claude-3.5-sonnet</code>
            </span>
          </div>
        </div>

        <div className="modal-box-footer">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-modal-save" onClick={onSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
