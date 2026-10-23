import React, { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  Layers,
  Layout,
  Globe,
  AlertCircle
} from 'lucide-react';
import Navbar from './components/Navbar';
import HeroInput from './components/HeroInput';
import AuditProgress from './components/AuditProgress';
import OverviewBar from './components/OverviewBar';
import WeaknessList from './components/WeaknessList';
import ExecutiveSummary from './components/ExecutiveSummary';
import BlueprintView from './components/BlueprintView';
import TechnicalAudit from './components/TechnicalAudit';
import CrawledPagesView from './components/CrawledPagesView';
import { exportToCsv } from './utils/exportCsv';
import './index.css';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('weaknesses');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleAnalyze = async (overrideUrl) => {
    const rawUrl = (overrideUrl || urlInput || '').trim();
    if (!rawUrl) {
      setErrorMsg('Please specify a target website URL to audit.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setActiveStep(1);

    const stepTimer1 = setTimeout(() => setActiveStep(2), 2200);
    const stepTimer2 = setTimeout(() => setActiveStep(3), 5500);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: rawUrl,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to complete website audit.');
        setLoading(false);
        setActiveStep(0);
        return;
      }

      setActiveStep(4);
      setTimeout(() => {
        setAnalysisData(data);
        setLoading(false);
        setActiveStep(0);
      }, 500);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setErrorMsg(`Connection error: ${err.message}.`);
      setLoading(false);
      setActiveStep(0);
    }
  };

  const handleLoadSample = async () => {
    setErrorMsg('');
    setLoading(true);
    setActiveStep(1);
    try {
      const res = await fetch('/api/sample');
      const data = await res.json();
      setTimeout(() => {
        setAnalysisData(data);
        setUrlInput(data.targetUrl);
        setLoading(false);
        setActiveStep(0);
      }, 600);
    } catch (err) {
      setErrorMsg('Failed to load sample preview.');
      setLoading(false);
      setActiveStep(0);
    }
  };

  const handleQuickSelect = (value) => {
    if (value === 'demo') {
      handleLoadSample();
    } else {
      setUrlInput(value);
      handleAnalyze(value);
    }
  };

  const handleDownloadCsv = () => {
    if (!analysisData) return;
    exportToCsv(analysisData);
  };

  const handleCopySummary = () => {
    if (!analysisData?.auditResult?.executiveSummary) return;
    navigator.clipboard.writeText(
      `SiteSift Executive Briefing for ${analysisData.domain}:\n\n` +
      `Conversion Health: ${analysisData.auditResult.siteHealthScore}/100 | Risk: ${analysisData.auditResult.revenueRiskLevel}\n\n` +
      `${analysisData.auditResult.executiveSummary}\n\n` +
      `Estimated Drag: ${analysisData.auditResult.estimatedMonthlyBounceCost}`
    );
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const weaknessesCount = (analysisData?.auditResult?.weaknesses || []).length;
  const pagesCount = analysisData?.crawlResult?.pagesCount || 1;

  return (
    <div className="sitesift-app-shell">
      <Navbar
        onLoadSample={handleLoadSample}
        loading={loading}
      />

      <HeroInput
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        onAnalyze={() => handleAnalyze()}
        onQuickSelect={handleQuickSelect}
        loading={loading}
      />

      {errorMsg && (
        <div className="alert-callout-box">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {loading && (
        <AuditProgress
          activeStep={activeStep}
          targetUrl={urlInput}
        />
      )}

      {analysisData && !loading && (
        <main className="dashboard-content-area">
          <OverviewBar
            analysisData={analysisData}
            onDownloadCsv={handleDownloadCsv}
            onCopySummary={handleCopySummary}
            copiedSummary={copiedSummary}
          />

          <nav className="dossier-tab-navigation">
            <button
              type="button"
              className={`dossier-tab-btn ${activeTab === 'weaknesses' ? 'active' : ''}`}
              onClick={() => setActiveTab('weaknesses')}
            >
              <AlertTriangle size={15} />
              <span>Customer Friction Points</span>
              <span className="tab-tag-count">{weaknessesCount}</span>
            </button>

            <button
              type="button"
              className={`dossier-tab-btn ${activeTab === 'executive' ? 'active' : ''}`}
              onClick={() => setActiveTab('executive')}
            >
              <Zap size={15} />
              <span>Executive Briefing</span>
            </button>

            <button
              type="button"
              className={`dossier-tab-btn ${activeTab === 'blueprint' ? 'active' : ''}`}
              onClick={() => setActiveTab('blueprint')}
            >
              <Layers size={15} />
              <span>Extracted Blueprint</span>
            </button>

            <button
              type="button"
              className={`dossier-tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <Layout size={15} />
              <span>Technical & SERP</span>
            </button>

            <button
              type="button"
              className={`dossier-tab-btn ${activeTab === 'pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              <Globe size={15} />
              <span>Audited Pages</span>
              <span className="tab-tag-count">{pagesCount}</span>
            </button>
          </nav>

          {activeTab === 'weaknesses' && (
            <WeaknessList weaknesses={analysisData.auditResult?.weaknesses} />
          )}

          {activeTab === 'executive' && (
            <ExecutiveSummary auditResult={analysisData.auditResult} />
          )}

          {activeTab === 'blueprint' && (
            <BlueprintView
              blueprint={analysisData.extractedBlueprint}
              crawlResult={analysisData.crawlResult}
            />
          )}

          {activeTab === 'technical' && (
            <TechnicalAudit
              primaryPage={analysisData.crawlResult?.primaryPage}
              targetUrl={analysisData.targetUrl}
            />
          )}

          {activeTab === 'pages' && (
            <CrawledPagesView
              pages={analysisData.crawlResult?.crawledPages || [analysisData.crawlResult?.primaryPage]}
            />
          )}
        </main>
      )}
    </div>
  );
}
