import React from 'react';
import { Radio, Binary, Hash, ShieldCheck, Terminal as TerminalIcon, Cpu } from 'lucide-react';

interface CyberRadarScannerProps {
  step: number;
  fileName?: string;
}

export const CyberRadarScanner: React.FC<CyberRadarScannerProps> = ({ step, fileName }) => {
  return (
    <div className="radar-scanner-box">
      <div className="radar-laser-sweep" />

      {/* Futuristic Radar Animation Hub */}
      <div className="radar-graphic-hub">
        <div className="radar-outer-ring" />
        <div className="radar-middle-ring" />
        <div className="radar-inner-ring" />
        <div className="radar-sweep-beam" />
        <div className="radar-crosshair-h" />
        <div className="radar-crosshair-v" />
        <div className="radar-center-core">
          <Cpu size={22} className="neon-cyan-text spin" />
        </div>
      </div>

      {/* Telemetry Stage Indicators */}
      <div className="radar-telemetry">
        <div className="radar-header">
          <div className="radar-title-wrap">
            <Radio size={14} className="spin neon-cyan-text" />
            <span className="radar-title">DEEP TELEMETRY &amp; HEURISTIC SCAN</span>
          </div>
          <span className="radar-step-counter">STAGE 0{step}/04</span>
        </div>

        {fileName && (
          <div className="radar-file-tag">
            <span>TARGET_PAYLOAD:</span> {fileName}
          </div>
        )}

        <div className="radar-steps-list">
          <div className={`radar-step-item ${step >= 1 ? 'active' : ''}`}>
            <TerminalIcon size={13} className="step-icon" />
            <span className="step-text">[01/04] VERIFYING MAGIC BYTES (%PDF-1.7) &amp; MEMORY BUFFER...</span>
            {step > 1 && <span className="step-status">VERIFIED</span>}
          </div>

          <div className={`radar-step-item ${step >= 2 ? 'active' : ''}`}>
            <Binary size={13} className="step-icon" />
            <span className="step-text">[02/04] INDEXING XREF OFFSET TABLES &amp; CATALOG DICTIONARY...</span>
            {step > 2 && <span className="step-status">INDEXED</span>}
          </div>

          <div className={`radar-step-item ${step >= 3 ? 'active' : ''}`}>
            <ShieldCheck size={13} className="step-icon" />
            <span className="step-text">[03/04] HEURISTIC PROBE: CHECKING /JAVASCRIPT &amp; /LAUNCH VECTORS...</span>
            {step > 3 && <span className="step-status">PASSED</span>}
          </div>

          <div className={`radar-step-item ${step >= 4 ? 'active' : ''}`}>
            <Hash size={13} className="step-icon" />
            <span className="step-text">[04/04] COMPUTING SHA-256 DIGITAL INTEGRITY DIGEST...</span>
            {step >= 4 && <span className="step-status">COMPUTED</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
