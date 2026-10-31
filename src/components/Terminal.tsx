import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from '../audio';

export interface TerminalLog {
  id: string;
  timestamp: string;
  subsystem: 'SYS' | 'KERN' | 'CIPHER' | 'HASH' | 'XREF' | 'WARN' | 'EXEC' | 'IO' | 'PRNG';
  message: string;
  level?: 'info' | 'success' | 'warn' | 'error' | 'dim';
}

interface TerminalProps {
  logs: TerminalLog[];
  onClear: () => void;
  onRunCommand?: (cmd: string) => void;
  isBusy?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  logs,
  onClear,
  onRunCommand,
  isBusy = false,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever new logs arrive
  useEffect(() => {
    if (!isMinimized) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    cyberAudio.playKeyClick();
    if (e.key === 'Enter') {
      const trimmed = inputVal.trim();
      if (trimmed) {
        setHistory((prev) => [...prev, trimmed]);
        setHistoryIdx(-1);
        if (onRunCommand) {
          onRunCommand(trimmed);
        }
        setInputVal('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInputVal('');
        } else {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx] || '');
        }
      }
    }
  };

  const getSubsystemColor = (sub: TerminalLog['subsystem']) => {
    switch (sub) {
      case 'CIPHER': return 'var(--neon-cyan)';
      case 'KERN': return 'var(--neon-green)';
      case 'HASH': return '#ff00ea';
      case 'XREF': return '#38bdf8';
      case 'PRNG': return '#f59e0b';
      case 'WARN': return 'var(--neon-amber)';
      case 'EXEC': return '#a855f7';
      case 'IO': return '#3b82f6';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className={`cyber-terminal-panel ${isMinimized ? 'minimized' : ''}`}>
      {/* Terminal Title Bar */}
      <div className="terminal-header">
        <div className="terminal-header-left">
          <div className="terminal-led pulsing" />
          <TerminalIcon size={14} className="terminal-header-icon" />
          <span className="terminal-title">TERMINAL // TTY-01 [LIVE_STREAM]</span>
          {isBusy && <span className="terminal-exec-tag">EXEC_BUSY</span>}
        </div>
        <div className="terminal-header-actions">
          <button
            type="button"
            className="terminal-btn"
            onClick={() => {
              cyberAudio.playKeyClick();
              onClear();
            }}
            title="Clear terminal buffer"
          >
            <Trash2 size={12} />
            <span>CLEAR</span>
          </button>
          <button
            type="button"
            className="terminal-btn"
            onClick={() => {
              cyberAudio.playKeyClick();
              setIsMinimized(!isMinimized);
            }}
            title={isMinimized ? 'Expand terminal' : 'Minimize terminal'}
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            <span>{isMinimized ? 'EXPAND' : 'MIN'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {!isMinimized && (
        <div className="terminal-content">
          <div className="terminal-scroll-area">
            {logs.map((log) => (
              <div key={log.id} className={`terminal-line level-${log.level || 'info'}`}>
                <span className="terminal-time">[{log.timestamp}]</span>
                <span
                  className="terminal-sub"
                  style={{ color: getSubsystemColor(log.subsystem) }}
                >
                  [{log.subsystem}]
                </span>
                <span className="terminal-msg">{log.message}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Command Prompt Line */}
          <div
            className="terminal-prompt-bar"
            onClick={() => inputRef.current?.focus()}
          >
            <span className="terminal-prompt-user">root@cyberlock:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'help', 'status', 'cipher', 'entropy'..."
              spellCheck="false"
              autoComplete="off"
              className="terminal-input"
            />
            <CornerDownLeft size={12} className="terminal-enter-icon" />
          </div>
        </div>
      )}
    </div>
  );
};
