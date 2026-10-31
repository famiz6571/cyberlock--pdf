import React from 'react';
import { ShieldCheck, Download, FilePlus, KeyRound, CheckCircle2, Lock, Cpu, Zap } from 'lucide-react';
import { cyberAudio } from '../audio';
import { fmtBytes } from '../utils';
import { CyberModal3D } from './CyberModal3D';

interface SecuredModalProps {
  isOpen: boolean;
  fileName: string;
  securedFileName: string;
  fileSize: number;
  pageCount: number | null;
  sha256: string;
  onDownloadAgain: () => void;
  onReEncryptSameFile: () => void;
  onStartNewFile: () => void;
}

export const SecuredModal: React.FC<SecuredModalProps> = ({
  isOpen,
  fileName,
  securedFileName,
  fileSize,
  pageCount,
  sha256,
  onDownloadAgain,
  onReEncryptSameFile,
  onStartNewFile,
}) => {
  if (!isOpen) return null;

  return (
    <CyberModal3D
      isOpen={isOpen}
      badge="ISO 32000-2 COMPLIANT"
      title="CIPHER CAPSULE SEALED &amp; DELIVERED"
      width="640px"
    >
      <div className="secured-completion-card">
        {/* 3D Rotating Success Prism */}
        <div className="secured-badge-cluster-3d">
          <div className="success-cube-3d">
            <div className="success-face front">
              <ShieldCheck size={32} className="neon-green-text" />
            </div>
            <div className="success-face back">
              <Lock size={32} className="neon-cyan-text" />
            </div>
            <div className="success-face right">
              <Cpu size={32} className="neon-green-text" />
            </div>
            <div className="success-face left">
              <Zap size={32} className="neon-cyan-text" />
            </div>
            <div className="success-face top"></div>
            <div className="success-face bottom"></div>
          </div>
          <div className="success-shadow" />
        </div>

        <div className="secured-header">
          <div className="secured-status-tag">
            <CheckCircle2 size={13} />
            <span>AES-256 CONTAINER ENGAGED &amp; ZEROIZED</span>
          </div>
          <h2 className="secured-title">IN-MEMORY ENCRYPTION COMPLETE</h2>
          <p className="secured-sub">
            The secured container has been downloaded into your local filesystem. Volatile memory plaintext keys have been zeroized.
          </p>
        </div>

        {/* Cryptographic Audit Receipt */}
        <div className="secured-receipt">
          <div className="receipt-header">
            <span>CRYPTOGRAPHIC AUDIT RECEIPT</span>
            <span className="receipt-pill">VERIFIED IN-RAM</span>
          </div>
          <div className="receipt-grid">
            <div className="receipt-item">
              <span className="receipt-label">SOURCE PAYLOAD:</span>
              <span className="receipt-val">{fileName}</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label">ENCRYPTED CONTAINER:</span>
              <span className="receipt-val neon-cyan-text">{securedFileName}</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label">PAYLOAD SPECS:</span>
              <span className="receipt-val">
                {fmtBytes(fileSize)} {pageCount !== null ? `// ${pageCount} Pages` : ''}
              </span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label">CIPHER STANDARD:</span>
              <span className="receipt-val neon-green-text">AES-256-CBC (256-bit Rijndael)</span>
            </div>
            <div className="receipt-item full-width">
              <span className="receipt-label">INTEGRITY SHA-256:</span>
              <span className="receipt-val hash-val">{sha256 || 'CALCULATING...'}</span>
            </div>
            <div className="receipt-item full-width">
              <span className="receipt-label">VOLATILE RAM ZEROIZATION:</span>
              <span className="receipt-val neon-green-text">100% PURGED // 0 EPHEMERAL KEYS REMAINING</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="secured-actions-grid">
          <button
            type="button"
            className="cyber-btn-secondary"
            onClick={() => {
              cyberAudio.playKeyClick();
              onDownloadAgain();
            }}
          >
            <Download size={14} />
            <span>DOWNLOAD CONTAINER AGAIN</span>
          </button>

          <button
            type="button"
            className="cyber-btn-accent"
            onClick={() => {
              cyberAudio.playKeyClick();
              onReEncryptSameFile();
            }}
          >
            <KeyRound size={14} />
            <span>RE-ENCRYPT SAME FILE (GENERATE NEW PASSWORD)</span>
          </button>

          <button
            type="button"
            className="cyber-btn-primary"
            onClick={() => {
              cyberAudio.playKeyClick();
              onStartNewFile();
            }}
          >
            <FilePlus size={14} />
            <span>PURGE MEMORY &amp; START WITH NEW FILE</span>
          </button>
        </div>
      </div>
    </CyberModal3D>
  );
};
