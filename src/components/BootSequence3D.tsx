import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Terminal, Zap, FastForward } from 'lucide-react';
import { cyberAudio } from '../audio';

interface BootSequence3DProps {
  onComplete: () => void;
}

export const BootSequence3D: React.FC<BootSequence3DProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const bootLogs = [
    'INITIALIZING SEC_KRNL 0x7FFF9E04 [VOLATILE RAM ALLOCATION]',
    'PROBING HARDWARE AES-NI INSTRUCTION PIPELINES // DETECTED',
    'SYNCHRONIZING NEURAL SYNAPSE BUS (85 NODES CONNECTED)',
    'SEEDING 512-BIT CSPRNG ENTROPY POOL FROM HARDWARE JITTER',
    'AIR-GAPPED CLIENT ENCLAVE ARMED // DEFCON 1 READY',
  ];

  useEffect(() => {
    cyberAudio.playScanChirp();

    // Progress bar and step interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8 + 5);
        return Math.min(100, next);
      });
    }, 120);

    const stepTimers = [
      setTimeout(() => { setBootStep(1); cyberAudio.playBeep(750, 0.04); }, 400),
      setTimeout(() => { setBootStep(2); cyberAudio.playBeep(880, 0.04); }, 900),
      setTimeout(() => { setBootStep(3); cyberAudio.playBeep(1020, 0.04); }, 1500),
      setTimeout(() => { setBootStep(4); cyberAudio.playBeep(1180, 0.04); }, 2100),
      setTimeout(() => {
        setBootStep(5);
        cyberAudio.playSuccess();
        setIsFadingOut(true);
        setTimeout(onComplete, 600);
      }, 2700),
    ];

    return () => {
      clearInterval(interval);
      stepTimers.forEach(clearTimeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    cyberAudio.playKeyClick();
    setIsFadingOut(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div className={`boot-overlay-3d ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="boot-grid-bg" />

      <div className="boot-container-3d">
        {/* 3D Wireframe Cyber Cube */}
        <div className="cube-3d-scene">
          <div className="cube-3d">
            <div className="cube-face front">
              <Cpu size={32} className="neon-cyan-text" />
            </div>
            <div className="cube-face back">
              <Shield size={32} className="neon-green-text" />
            </div>
            <div className="cube-face right">
              <Zap size={32} className="neon-cyan-text" />
            </div>
            <div className="cube-face left">
              <Terminal size={32} className="neon-purple-text" />
            </div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
          <div className="cube-shadow-ring" />
        </div>

        {/* Brand Title */}
        <div className="boot-header-3d">
          <div className="boot-pill">BIOS PROTOCOL v3.8-MIL</div>
          <h1 className="boot-title-3d">
            CYBER<span>LOCK</span>
          </h1>
          <p className="boot-subtitle-3d">QUANTUM-GRADE LOCAL PDF CIPHER ENCLAVE</p>
        </div>

        {/* 3D Progress Bar */}
        <div className="boot-progress-wrap-3d">
          <div className="boot-progress-track-3d">
            <div className="boot-progress-fill-3d" style={{ width: `${progress}%` }} />
            <div className="boot-progress-glint" style={{ left: `${progress}%` }} />
          </div>
          <div className="boot-progress-meta">
            <span>LOADING REVISION 6 SECURITY HANDLERS</span>
            <span className="boot-percent">{progress}%</span>
          </div>
        </div>

        {/* Boot Terminal Logs */}
        <div className="boot-terminal-box">
          {bootLogs.slice(0, bootStep).map((log, idx) => (
            <div key={idx} className="boot-terminal-line">
              <span className="boot-line-prefix">&gt;</span>
              <span className="boot-line-text">{log}</span>
            </div>
          ))}
          {bootStep < 5 && (
            <div className="boot-terminal-line current">
              <span className="boot-line-prefix">&gt;</span>
              <span className="boot-cursor-blink">_</span>
            </div>
          )}
        </div>

        {/* Skip Button */}
        <button type="button" className="boot-skip-btn" onClick={handleSkip}>
          <FastForward size={12} />
          <span>BYPASS BIOS BOOT [SKIP]</span>
        </button>
      </div>
    </div>
  );
};
