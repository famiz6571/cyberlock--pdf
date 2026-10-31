import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Volume2, VolumeX, Network, ShieldCheck } from 'lucide-react';
import { cyberAudio } from '../audio';

interface TelemetryHudProps {
  isProcessing?: boolean;
}

export const TelemetryHud: React.FC<TelemetryHudProps> = ({ isProcessing = false }) => {
  const [entropyRate, setEntropyRate] = useState(99.6);
  const [threadLoads, setThreadLoads] = useState([42, 65, 38, 71]);
  const [isMuted, setIsMuted] = useState(cyberAudio.getMuted());
  const [synapseSync, setSynapseSync] = useState(85);

  // Fluctuate telemetry values dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setEntropyRate((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Number(Math.min(99.9, Math.max(98.8, prev + delta)).toFixed(1));
      });

      setSynapseSync((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * 4);
        return Math.min(96, Math.max(82, prev + delta));
      });

      setThreadLoads(() => {
        if (isProcessing) {
          return [
            Math.floor(84 + Math.random() * 16),
            Math.floor(89 + Math.random() * 11),
            Math.floor(81 + Math.random() * 19),
            Math.floor(92 + Math.random() * 8),
          ];
        }
        return [
          Math.floor(25 + Math.random() * 25),
          Math.floor(35 + Math.random() * 30),
          Math.floor(20 + Math.random() * 25),
          Math.floor(30 + Math.random() * 25),
        ];
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleToggleAudio = () => {
    const nextMuted = cyberAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="telemetry-hud-bar">
      {/* Crypto Hardware Threads */}
      <div className="telemetry-group">
        <div className="telemetry-label">
          <Cpu size={12} className="neon-cyan-text" />
          <span>CRYPTO CORES</span>
        </div>
        <div className="thread-bars">
          {threadLoads.map((load, idx) => (
            <div key={idx} className="thread-item" title={`Core ${idx + 1}: ${load}%`}>
              <div
                className={`thread-fill ${isProcessing ? 'intense' : ''}`}
                style={{ height: `${load}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Entropy Gauge */}
      <div className="telemetry-group">
        <div className="telemetry-label">
          <Activity size={12} className="neon-green-text" />
          <span>ENTROPY RESERVOIR</span>
        </div>
        <div className="entropy-val-wrap">
          <span className="entropy-val">{entropyRate}%</span>
          <span className="entropy-tag">CSPRNG</span>
        </div>
      </div>

      {/* Neural Synapse Monitor */}
      <div className="telemetry-group">
        <div className="telemetry-label">
          <Network size={12} className="neon-purple-text" />
          <span>NEURAL MESH</span>
        </div>
        <div className="entropy-val-wrap">
          <span className="neural-val">{synapseSync} SYNAPSES</span>
        </div>
      </div>

      {/* Audio FX Toggle */}
      <div className="telemetry-group telemetry-controls">
        <button
          type="button"
          className={`telemetry-btn ${!isMuted ? 'active-audio' : ''}`}
          onClick={handleToggleAudio}
          title={isMuted ? 'Enable Cyber Audio FX' : 'Mute Cyber Audio FX'}
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="neon-cyan-text" />}
          <span>{isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
        </button>
      </div>
    </div>
  );
};
