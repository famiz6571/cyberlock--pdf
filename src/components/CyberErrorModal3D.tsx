import React from 'react';
import { AlertTriangle, ShieldAlert, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { CyberModal3D } from './CyberModal3D';
import { cyberAudio } from '../audio';

interface CyberErrorModal3DProps {
  isOpen: boolean;
  message: string;
  onDismiss: () => void;
}

export const CyberErrorModal3D: React.FC<CyberErrorModal3DProps> = ({
  isOpen,
  message,
  onDismiss,
}) => {
  if (!isOpen) return null;

  // Synthesize a cool hacker fault code from the error message
  const isMismatch = message.includes('MISMATCH');
  const isCorrupt = message.includes('CORRUPTED') || message.includes('ENCRYPTED');
  const isPayload = message.includes('PAYLOAD') || message.includes('100MB');

  const faultCode = isMismatch
    ? 'ERR_KEY_MISMATCH // CODE: 0x4B12'
    : isCorrupt
    ? 'ERR_CIPHER_CONFLICT // CODE: 0x8E99'
    : isPayload
    ? 'ERR_PAYLOAD_REJECT // CODE: 0x2A05'
    : 'ERR_CIPHER_FAULT // CODE: 0x99FF';

  return (
    <CyberModal3D
      isOpen={isOpen}
      onClose={onDismiss}
      badge="DEFCON 1 ALERT"
      title="CRYPTOGRAPHIC ANOMALY DETECTED"
      width="540px"
    >
      <div className="error-modal-3d-body">
        {/* 3D Rotating Hazard Beacon */}
        <div className="error-beacon-scene-3d">
          <div className="hazard-cube-3d">
            <div className="hazard-face front">
              <ShieldAlert size={28} className="neon-red-text" />
            </div>
            <div className="hazard-face back">
              <AlertTriangle size={28} className="neon-red-text" />
            </div>
            <div className="hazard-face right">
              <XCircle size={28} className="neon-amber-text" />
            </div>
            <div className="hazard-face left">
              <ShieldAlert size={28} className="neon-red-text" />
            </div>
            <div className="hazard-face top"></div>
            <div className="hazard-face bottom"></div>
          </div>
          <div className="hazard-shadow" />
        </div>

        {/* Error Code & Details */}
        <div className="error-details-3d">
          <div className="fault-code-badge">{faultCode}</div>
          <h3 className="error-headline-3d">SECURITY PROTOCOL HALTED</h3>
          <p className="error-message-text">{message}</p>
        </div>

        {/* Diagnostic Suggestion Box */}
        <div className="error-diagnostics-box">
          <div className="diag-header">HEURISTIC DIAGNOSTIC:</div>
          <div className="diag-content">
            {isMismatch && 'Passphrase verification failed. Ensure both cipher inputs match with exact case sensitivity.'}
            {isCorrupt && 'The uploaded PDF appears already encrypted with an existing owner password or contains corrupted XREF trees.'}
            {isPayload && 'Ensure file has .pdf extension and does not exceed the 100MB volatile memory allocation ceiling.'}
            {!isMismatch && !isCorrupt && !isPayload && 'Cryptographic sub-routine aborted. Verify browser WebCrypto permissions.'}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="cyber-error-dismiss-btn"
          onClick={() => {
            cyberAudio.playKeyClick();
            onDismiss();
          }}
        >
          <RotateCcw size={14} />
          <span>ACKNOWLEDGE &amp; RESUME OPERATIONS</span>
        </button>
      </div>
    </CyberModal3D>
  );
};
