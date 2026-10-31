import React from 'react';
import { Lock, Loader2, Shield, KeyRound, Binary, Zap, Cpu } from 'lucide-react';

interface CipherLockVaultProps {
  step: number;
}

export const CipherLockVault: React.FC<CipherLockVaultProps> = ({ step }) => {
  const stageLabels = [
    { title: 'ENTROPY SIPHON', desc: 'Harvesting 512-bit CSPRNG nonces & salt vectors', sub: 'PRNG' },
    { title: 'KEY EXPANSION', desc: '100,000 PBKDF2-HMAC-SHA256 key scheduling rounds', sub: 'KEY_EXP' },
    { title: 'SECURITY INJECTION', desc: 'Injecting ISO 32000-2 Revision 6 security handler', sub: 'REV_6' },
    { title: 'CIPHERSTREAM SCRAMBLE', desc: 'AES-256-CBC stream transformation on page xrefs', sub: 'AES_256' },
    { title: 'INTEGRITY SEAL', desc: 'Computing cryptographic MAC & tamper-evident signature', sub: 'MAC_SEAL' },
    { title: 'REGISTER ZEROIZATION', desc: 'Scrubbing volatile RAM buffers & ephemeral keys', sub: 'ZEROIZE' },
  ];

  const currentStage = stageLabels[Math.min(stageLabels.length - 1, Math.max(0, step - 1))];
  const progressPercent = Math.min(100, Math.round((step / 6) * 100));

  return (
    <div className="cipher-vault-box">
      {/* Holographic Rotating Vault Lock Mechanism */}
      <div className="vault-graphic-hub">
        <div className="vault-ring-outer" />
        <div className="vault-ring-middle" />
        <div className="vault-ring-inner" />
        <div className="vault-ticks" />
        <div className="vault-core-lock">
          <Lock size={26} className="neon-cyan-text pulse-lock" />
        </div>
      </div>

      {/* Progress & Stage Details */}
      <div className="vault-status-hub">
        <div className="vault-header">
          <div className="vault-header-left">
            <Loader2 size={15} className="spin neon-green-text" />
            <span className="vault-title">AES-256 CRYPTOGRAPHIC PIPELINE</span>
          </div>
          <span className="vault-stage-tag">STAGE 0{step}/06 [ {progressPercent}% ]</span>
        </div>

        <div className="vault-current-stage">
          <div className="stage-badge-row">
            <span className="stage-sub-badge">[{currentStage.sub}]</span>
            <span className="stage-title">{currentStage.title}</span>
          </div>
          <p className="stage-desc">{currentStage.desc}</p>
        </div>

        {/* Multi-Segmented High-Tech Progress Bar */}
        <div className="vault-progress-track">
          {[1, 2, 3, 4, 5, 6].map((seg) => (
            <div
              key={seg}
              className={`vault-progress-segment ${seg <= step ? 'filled' : ''} ${
                seg === step ? 'active-pulse' : ''
              }`}
            />
          ))}
        </div>

        <div className="vault-telemetry-metrics">
          <span>ALGORITHM: AES-256-CBC</span>
          <span>KEY LENGTH: 256 BITS</span>
          <span>VOLATILE REGISTERS: LOCKED</span>
        </div>
      </div>
    </div>
  );
};
