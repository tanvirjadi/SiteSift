import React from 'react';
import { Check, Loader2, Globe, Layers, ShieldAlert, FileSpreadsheet } from 'lucide-react';

export default function AuditProgress({ activeStep, targetUrl }) {
  const steps = [
    {
      num: '01',
      title: 'Web Crawler',
      detail: 'Extracting metadata, headings, forms & subpages',
      icon: Globe
    },
    {
      num: '02',
      title: 'Agent 1: Extraction',
      detail: 'Distilling value proposition & customer profile',
      icon: Layers
    },
    {
      num: '03',
      title: 'Agent 2: Auditor',
      detail: 'Diagnosing revenue leaks & buyer drop-offs',
      icon: ShieldAlert
    },
    {
      num: '04',
      title: 'Synthesis',
      detail: 'Compiling executive audit & export matrix',
      icon: FileSpreadsheet
    }
  ];

  return (
    <div className="progress-dossier-card">
      <div className="progress-meta-row">
        <span className="pipeline-label">PIPELINE EXECUTION</span>
        <span className="target-url-label">{targetUrl}</span>
      </div>

      <div className="progress-timeline-grid">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = activeStep > stepNum;
          const isCurrent = activeStep === stepNum;
          const IconComponent = step.icon;

          return (
            <div
              key={step.num}
              className={`timeline-step-cell ${isDone ? 'done' : isCurrent ? 'current' : 'pending'}`}
            >
              <div className="step-cell-header">
                <span className="step-seq">{step.num}</span>
                <div className="step-state-badge">
                  {isDone ? (
                    <Check size={14} className="icon-done" />
                  ) : isCurrent ? (
                    <Loader2 size={14} className="spin-icon" />
                  ) : (
                    <IconComponent size={14} />
                  )}
                </div>
              </div>

              <div className="step-cell-title">{step.title}</div>
              <div className="step-cell-detail">{step.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
