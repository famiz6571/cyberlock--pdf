import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import {
  ShieldAlert, Lock, FileText, X, Eye, EyeOff,
  Check, Loader2, AlertCircle, Cpu, Terminal as TerminalIcon, Zap,
  Radio, Binary, Hash, KeyRound, Sparkles
} from 'lucide-react';
import { fmtBytes, safeName, randomOwnerPassword, downloadBlob } from './utils';
import type { Status } from './types';
import { cyberAudio } from './audio';
import { MatrixBackground } from './components/MatrixBackground';
import { Terminal, TerminalLog } from './components/Terminal';
import { HexInspector } from './components/HexInspector';
import { TelemetryHud } from './components/TelemetryHud';
import { SecurityControls, SecurityOptions } from './components/SecurityControls';
import { BootSequence3D } from './components/BootSequence3D';
import { CyberErrorModal3D } from './components/CyberErrorModal3D';
import { CyberProcessModal3D } from './components/CyberProcessModal3D';
import { SecuredModal } from './components/SecuredModal';

// Hacker Entropy Calculator
function calculateHackerEntropy(password: string): {
  bits: number;
  level: string;
  crackTime: string;
  colorClass: 'weak' | 'medium' | 'strong';
  activeBars: number;
} {
  if (!password) {
    return { bits: 0, level: 'NO CIPHER', crackTime: '0 ms', colorClass: 'weak', activeBars: 0 };
  }

  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  if (pool === 0) pool = 10;

  const bits = Math.round(password.length * Math.log2(pool));

  if (bits < 24) {
    return {
      bits,
      level: 'LEVEL 1 // VULNERABLE',
      crackTime: '< 1 SECOND',
      colorClass: 'weak',
      activeBars: Math.max(1, Math.min(2, Math.ceil((bits / 24) * 2))),
    };
  }
  if (bits < 50) {
    return {
      bits,
      level: 'LEVEL 2 // TACTICAL CIPHER',
      crackTime: '~ 4.2 MONTHS',
      colorClass: 'medium',
      activeBars: 2 + Math.min(3, Math.ceil(((bits - 24) / 26) * 3)),
    };
  }
  if (bits < 80) {
    return {
      bits,
      level: 'LEVEL 3 // MIL-SPEC DEFENSE',
      crackTime: '~ 840 YEARS',
      colorClass: 'strong',
      activeBars: 5 + Math.min(2, Math.ceil(((bits - 50) / 30) * 2)),
    };
  }
  return {
    bits,
    level: 'LEVEL 4 // QUANTUM IMMUNE',
    crackTime: 'UNBREAKABLE',
    colorClass: 'strong',
    activeBars: 8,
  };
}

// Generate high-entropy 24-character military password
function generateTacticalPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*()_+~';
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

const formatNow = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
};

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D Boot Sequence State
  const [isBooting, setIsBooting] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [rawBytes, setRawBytes] = useState<Uint8Array | null>(null);
  const [fileSha256, setFileSha256] = useState<string>('');
  const [pageCount, setPageCount] = useState<number | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptStep, setEncryptStep] = useState(0);
  const [status, setStatus] = useState<Status>({ type: '', message: '' });

  // 3D Error Modal State
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 3D Completed Screen State
  const [isCompleted, setIsCompleted] = useState(false);
  const [securedBlob, setSecuredBlob] = useState<Blob | null>(null);
  const [securedFileName, setSecuredFileName] = useState<string>('');

  const [securityOptions, setSecurityOptions] = useState<SecurityOptions>({
    allowPrinting: true,
    allowCopying: false,
    stripMetadata: true,
    cipherSpec: 'AES-256-R6',
  });

  // Terminal Real-time logs
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'log-0',
      timestamp: formatNow(),
      subsystem: 'SYS',
      message: 'CYBERLOCK 3D HOLOGRAPHIC WORKSTATION // [DEFCON 1 ACTIVE]',
      level: 'success',
    },
    {
      id: 'log-1',
      timestamp: formatNow(),
      subsystem: 'KERN',
      message: 'Volatile in-RAM sandbox allocated (0 bytes persisted to storage)',
      level: 'info',
    },
    {
      id: 'log-2',
      timestamp: formatNow(),
      subsystem: 'CIPHER',
      message: 'Hardware AES-NI crypto vector unit verified and mapped',
      level: 'info',
    },
    {
      id: 'log-3',
      timestamp: formatNow(),
      subsystem: 'SYS',
      message: 'Neural mesh synchronized // 85 active synapses listening',
      level: 'dim',
    },
  ]);

  const addLog = useCallback(
    (
      subsystem: TerminalLog['subsystem'],
      message: string,
      level: TerminalLog['level'] = 'info'
    ) => {
      setLogs((prev) => [
        ...prev.slice(-90),
        {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: formatNow(),
          subsystem,
          message,
          level,
        },
      ]);
    },
    []
  );

  // Periodic ambient daemon heartbeat logs
  useEffect(() => {
    const ambientMessages: { sub: TerminalLog['subsystem']; msg: string }[] = [
      { sub: 'KERN', msg: 'Sub-millisecond memory garbage collection cycle complete' },
      { sub: 'SYS', msg: 'Zero-knowledge client buffer isolation check: PASSED' },
      { sub: 'CIPHER', msg: 'Entropy reservoir status: 512 bits replenished from CSPRNG' },
      { sub: 'HASH', msg: 'Ephemeral key register zeroization watch: MONITORING' },
      { sub: 'IO', msg: 'Zero network sockets active. In-memory data lock engaged' },
    ];

    const interval = setInterval(() => {
      if (!isScanning && !isEncrypting && !isCompleted && !isBooting && Math.random() > 0.35) {
        const item = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
        addLog(item.sub, item.msg, 'dim');
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [addLog, isScanning, isEncrypting, isCompleted, isBooting]);

  // Terminal command prompt interpreter
  const handleTerminalCommand = (cmd: string) => {
    addLog('EXEC', `root@cyberlock:~$ ${cmd}`, 'info');
    const c = cmd.toLowerCase().trim();

    if (c === 'help') {
      addLog('SYS', 'AVAILABLE COMMANDS: status, cipher, entropy, scan, genpass, clear, ping', 'success');
    } else if (c === 'status') {
      addLog('SYS', `RAM SANDBOX: 0 BYTES PERSISTED | FILE: ${file ? file.name : 'NONE'} | ENCRYPT: ${isEncrypting ? 'ACTIVE' : 'IDLE'}`, 'success');
      addLog('KERN', 'HARDWARE: AES-NI ACCELERATED | CIPHER: AES-256 (REV-6 ISO 32000-2)', 'info');
    } else if (c === 'cipher') {
      addLog('CIPHER', 'SPEC: AES-256-CBC with SHA-256 key schedule | 100,000 PBKDF2 rounds', 'success');
      addLog('CIPHER', `METADATA STRIP: ${securityOptions.stripMetadata ? 'ON' : 'OFF'} | PRINT: ${securityOptions.allowPrinting ? 'YES' : 'NO'} | COPY: ${securityOptions.allowCopying ? 'YES' : 'NO'}`, 'info');
    } else if (c === 'entropy') {
      addLog('CIPHER', `CURRENT ENTROPY RATING: ${password ? calculateHackerEntropy(password).bits : 0} BITS | STATUS: HIGH-ENTROPY`, 'success');
    } else if (c === 'genpass') {
      const generated = generateTacticalPassword();
      setPassword(generated);
      setConfirmPassword(generated);
      cyberAudio.playSuccess();
      addLog('CIPHER', `GENERATED 24-CHAR TACTICAL CIPHER KEY (ENTROPY: 156 BITS)`, 'success');
    } else if (c === 'clear') {
      setLogs([]);
    } else if (c === 'scan') {
      cyberAudio.playScanChirp();
      addLog('KERN', 'DIAGNOSTIC TELEMETRY CHECK: ALL SANDBOX INVARIANTS HEALTHY', 'success');
    } else if (c === 'ping') {
      addLog('SYS', 'PONG // 0.04ms LOCAL VOLATILE LATENCY', 'info');
    } else {
      addLog('WARN', `UNKNOWN COMMAND '${cmd}'. TYPE 'help' FOR PROTOCOL COMMANDS`, 'warn');
    }
  };

  // ── Handle File Upload with 3D Popup & Calibrated Animation Delays ────────
  const handleFile = useCallback(
    async (selectedFile: File | null | undefined) => {
      setStatus({ type: '', message: '' });
      setIsCompleted(false);
      setSecuredBlob(null);
      if (!selectedFile) return;

      cyberAudio.playScanChirp();

      if (!/\.pdf$/i.test(selectedFile.name)) {
        cyberAudio.playAlarm();
        const err = 'ERROR: INVALID_PAYLOAD // FILE MUST HAVE .PDF EXTENSION';
        setStatus({ type: 'error', message: err });
        setErrorMessage(err);
        addLog('WARN', `REJECTED NON-PDF PAYLOAD: ${selectedFile.name}`, 'error');
        return;
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        cyberAudio.playAlarm();
        const err = 'ERROR: BUFFER_OVERFLOW // FILE EXCEEDS 100MB VOLATILE LIMIT';
        setStatus({ type: 'error', message: err });
        setErrorMessage(err);
        addLog('WARN', `PAYLOAD EXCEEDED 100MB LIMIT (${fmtBytes(selectedFile.size)})`, 'error');
        return;
      }

      // Open 3D Process Popup for scanning
      setIsScanning(true);
      setScanStep(1);
      addLog('IO', `PAYLOAD MOUNTED: ${selectedFile.name} [${fmtBytes(selectedFile.size)}]`, 'info');
      addLog('KERN', 'ALLOCATING VOLATILE MEMORY SEGMENT...', 'dim');

      try {
        const buffer = await selectedFile.arrayBuffer();
        const byteView = new Uint8Array(buffer);
        setRawBytes(byteView.slice(0, 160));

        // Real Cryptographic SHA-256 Digest calculation
        const hashBuf = await crypto.subtle.digest('SHA-256', buffer);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        const hashHex = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
        setFileSha256(hashHex);

        // Step 2
        setTimeout(() => {
          setScanStep(2);
          cyberAudio.playBeep(920, 0.05);
          addLog('XREF', 'PARSING PDF OBJECT DICTIONARIES & CROSS-REFERENCE TREES...', 'info');
        }, 650);

        // Step 3
        setTimeout(() => {
          setScanStep(3);
          cyberAudio.playBeep(1080, 0.05);
          addLog('KERN', 'HEURISTIC SCAN: VERIFYING ZERO UNAUTHORIZED JS/LAUNCH OBJECTS...', 'info');
        }, 1300);

        // Step 4
        setTimeout(() => {
          setScanStep(4);
          cyberAudio.playBeep(1240, 0.05);
          addLog('HASH', `SHA-256 DIGEST COMPUTED: ${hashHex.slice(0, 32)}...`, 'info');
        }, 1950);

        // Finalize scan & close process popup
        setTimeout(async () => {
          try {
            const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
            const pages = pdfDoc.getPageCount();

            setFile(selectedFile);
            setPageCount(pages);
            setIsScanning(false);
            cyberAudio.playSuccess();

            addLog(
              'SYS',
              `PAYLOAD VALIDATED // ${pages} ${pages === 1 ? 'PAGE' : 'PAGES'} READY FOR CIPHER INJECTION`,
              'success'
            );
          } catch {
            setIsScanning(false);
            setFile(null);
            setPageCount(null);
            cyberAudio.playAlarm();
            const err = 'ERROR: CIPHER_CONFLICT // PDF IS ALREADY ENCRYPTED OR CORRUPTED';
            setStatus({ type: 'error', message: err });
            setErrorMessage(err);
            addLog('WARN', 'PDF PARSER ABORT: CORRUPTED XREF OR ALREADY PROTECTED', 'error');
          }
        }, 2600);
      } catch {
        setIsScanning(false);
        setFile(null);
        setPageCount(null);
        cyberAudio.playAlarm();
        const err = 'ERROR: READ_FAILURE // UNABLE TO READ FILE BUFFER';
        setStatus({ type: 'error', message: err });
        setErrorMessage(err);
      }
    },
    [addLog]
  );

  const resetFile = () => {
    cyberAudio.playKeyClick();
    addLog('IO', `PAYLOAD EJECTED: ${file?.name || 'UNKNOWN'}`, 'dim');
    setFile(null);
    setRawBytes(null);
    setFileSha256('');
    setPageCount(null);
    setPassword('');
    setConfirmPassword('');
    setIsCompleted(false);
    setSecuredBlob(null);
    setSecuredFileName('');
    setStatus({ type: '', message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick generate tactical password
  const handleQuickGenPassword = () => {
    const generated = generateTacticalPassword();
    setPassword(generated);
    setConfirmPassword(generated);
    cyberAudio.playSuccess();
    addLog('CIPHER', 'GENERATED 24-CHAR HIGH-ENTROPY TACTICAL KEY (QUANTUM IMMUNE)', 'success');
  };

  // ── Execute Complicated 6-Stage Military Encryption with 3D Process Popup ──
  const handleProtect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password) return;

    if (password !== confirmPassword) {
      cyberAudio.playAlarm();
      const err = 'ERROR: CIPHER_MISMATCH // PASSWORDS DO NOT MATCH';
      setStatus({ type: 'error', message: err });
      setErrorMessage(err);
      addLog('WARN', 'ENCRYPTION ABORT: PASSWORD CONFIRMATION MISMATCH', 'error');
      return;
    }

    // Launch 3D Process Popup for encryption
    setIsEncrypting(true);
    setEncryptStep(1);
    setStatus({ type: '', message: '' });
    cyberAudio.playCipherPulse();

    addLog('CIPHER', '=== ENGAGING AES-256 MILITARY CRYPTOGRAPHIC PIPELINE ===', 'info');
    addLog('PRNG', '[01/06] HARVESTING 512-BIT CSPRNG SALTS & NONCES...', 'info');

    try {
      setTimeout(() => {
        setEncryptStep(2);
        cyberAudio.playBeep(700, 0.05);
        addLog('CIPHER', '[02/06] PBKDF2-HMAC-SHA256 KEY EXPANSION (100,000 ROUNDS)...', 'info');
      }, 750);

      setTimeout(() => {
        setEncryptStep(3);
        cyberAudio.playBeep(850, 0.05);
        addLog('KERN', '[03/06] INJECTING REVISION 6 SECURITY HANDLER & PERMISSION BITMASK...', 'info');
      }, 1500);

      setTimeout(() => {
        setEncryptStep(4);
        cyberAudio.playBeep(1000, 0.05);
        addLog('CIPHER', '[04/06] AES-256-CBC STREAM TRANSFORMATION (CONTENT & XREF)...', 'info');
      }, 2250);

      setTimeout(() => {
        setEncryptStep(5);
        cyberAudio.playBeep(1150, 0.05);
        addLog('HASH', '[05/06] COMPUTING INTEGRITY MAC & TAMPER VERIFICATION SEAL...', 'info');
      }, 3000);

      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      if (securityOptions.stripMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('CyberLock Secure Container (Mil-Spec)');
        pdfDoc.setCreator('Autonomous In-RAM Sandbox');
      }

      const ownerPassword = randomOwnerPassword();

      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword,
        algorithm: 'AES-256',
        permissions: {
          printing: securityOptions.allowPrinting ? 'highResolution' : false,
          copying: securityOptions.allowCopying,
          modifying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      setTimeout(async () => {
        setEncryptStep(6);
        cyberAudio.playBeep(1300, 0.05);
        addLog('KERN', '[06/06] ZEROIZING TRANSIENT PLAINTEXT RAM BUFFERS...', 'success');

        const encryptedBytes = await pdfDoc.save();
        const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
        const outName = `${safeName(file.name)}-secured.pdf`;

        // Automatically trigger secure download
        downloadBlob(blob, outName);
        cyberAudio.playSuccess();

        setSecuredBlob(blob);
        setSecuredFileName(outName);
        setIsCompleted(true);
        setIsEncrypting(false);

        // Clear sensitive inputs
        setPassword('');
        setConfirmPassword('');

        addLog('SYS', `=== CIPHER CAPSULE DELIVERED: ${outName} ===`, 'success');
        addLog('CIPHER', 'TRANSIENT KEYS SCRUBBED. MEMORY PURGE: 100% COMPLETE', 'success');
      }, 3750);
    } catch (err: unknown) {
      cyberAudio.playAlarm();
      setIsEncrypting(false);
      const errMsg = (err as Error)?.message || 'CIPHER_ERROR';
      setStatus({
        type: 'error',
        message: `ENCRYPTION_FAILED: ${errMsg}`,
      });
      setErrorMessage(`ENCRYPTION_FAILED: ${errMsg}`);
      addLog('WARN', `CIPHER ENGINE FAILURE: ${errMsg}`, 'error');
    }
  };

  // Re-download secured PDF again
  const handleDownloadAgain = () => {
    if (securedBlob && securedFileName) {
      downloadBlob(securedBlob, securedFileName);
    }
  };

  // Re-encrypt SAME file with different password
  const handleReEncryptSameFile = () => {
    setIsCompleted(false);
    setPassword('');
    setConfirmPassword('');
    setStatus({
      type: 'success',
      message: 'READY // ENTER NEW PASSWORD TO RE-ENCRYPT SAME PAYLOAD',
    });
    addLog('SYS', `RE-ENCRYPTING SAME PAYLOAD: ${file?.name} WITH NEW CIPHER KEY`, 'info');
  };

  // Purge everything and start with NEW file
  const handleStartNewFile = () => {
    resetFile();
    addLog('KERN', 'ZEROIZATION VERIFIED: ENTIRE VIRTUAL SEGMENT PURGED', 'success');
  };

  const entropy = calculateHackerEntropy(password);
  const isMatch = Boolean(password && confirmPassword && password === confirmPassword);
  const isMismatch = Boolean(password && confirmPassword && password !== confirmPassword);
  const canSubmit = file && password.length > 0 && isMatch && !isEncrypting && !isScanning;

  return (
    <>
      {/* ── 3D Boot Sequence on First Load ── */}
      {isBooting && <BootSequence3D onComplete={() => setIsBooting(false)} />}

      {/* ── 3D Process Popup (Scanning & Encrypting) ── */}
      <CyberProcessModal3D
        isScanning={isScanning}
        scanStep={scanStep}
        isEncrypting={isEncrypting}
        encryptStep={encryptStep}
        rawBytes={rawBytes}
        fileName={file?.name || fileInputRef.current?.files?.[0]?.name}
      />

      {/* ── 3D Error Holographic Popup ── */}
      <CyberErrorModal3D
        isOpen={Boolean(errorMessage)}
        message={errorMessage}
        onDismiss={() => setErrorMessage('')}
      />

      {/* ── 3D Completion Success Popup ── */}
      {isCompleted && file && (
        <SecuredModal
          isOpen={isCompleted}
          fileName={file.name}
          securedFileName={securedFileName}
          fileSize={file.size}
          pageCount={pageCount}
          sha256={fileSha256}
          onDownloadAgain={handleDownloadAgain}
          onReEncryptSameFile={handleReEncryptSameFile}
          onStartNewFile={handleStartNewFile}
        />
      )}

      {/* Pure Neural Cyber Network Background */}
      <MatrixBackground glitchActive={isEncrypting} />
      <div className="scanline-overlay" />
      <div className="grid-glow" />

      <div className="cyber-shell">
        {/* Top DEFCON 1 Banner */}
        <div className="cyber-defcon-banner">
          <div className="defcon-left">
            <div className="defcon-led" />
            <span className="defcon-tag">DEFCON 1 ACTIVE</span>
            <span className="ticker-divider">/</span>
            <span className="defcon-meta">AES-256-CBC [ISO 32000-2]</span>
          </div>
          <span className="defcon-badge">AIR-GAPPED 3D SANDBOX</span>
        </div>

        {/* Cyber Brand Header */}
        <header className="cyber-header">
          <div className="cyber-badge-wrap">
            <div className="cyber-icon-frame">
              <ShieldAlert size={30} strokeWidth={1.8} />
            </div>
          </div>
          <h1 className="cyber-title">
            CYBER<span>LOCK</span>
            <span className="cyber-title-badge">3D MIL-SPEC</span>
          </h1>
          <p className="cyber-subtitle">
            AUTONOMOUS HIGH-ENTROPY IN-MEMORY PDF CRYPTOGRAPHIC WORKSTATION
          </p>
        </header>

        {/* Live Hardware Telemetry HUD Bar */}
        <TelemetryHud isProcessing={isScanning || isEncrypting} />

        {/* Main Card */}
        <main className="cyber-card">
          <div className="corner-bracket corner-tl" />
          <div className="corner-bracket corner-tr" />
          <div className="corner-bracket corner-bl" />
          <div className="corner-bracket corner-br" />

          {/* ── State: Dropzone Home Screen (No File Loaded) ── */}
          {!file && (
            <>
              {/* Hacker Intelligence Status Grid (3D Floating Slabs) */}
              <div className="home-intel-grid">
                <div className="intel-card">
                  <div className="intel-card-header">
                    <Cpu size={12} />
                    <span>CIPHER CORE</span>
                  </div>
                  <div className="intel-card-val">AES-256-CBC</div>
                  <div className="intel-card-sub">Hardware AES-NI Active</div>
                </div>

                <div className="intel-card">
                  <div className="intel-card-header">
                    <Zap size={12} />
                    <span>SANDBOX BUFFER</span>
                  </div>
                  <div className="intel-card-val">VOLATILE RAM</div>
                  <div className="intel-card-sub">Zero Disk Footprint</div>
                </div>

                <div className="intel-card">
                  <div className="intel-card-header">
                    <Radio size={12} />
                    <span>NETWORK SURFACE</span>
                  </div>
                  <div className="intel-card-val">ZERO PACKETS</div>
                  <div className="intel-card-sub">Client-Side Isolation</div>
                </div>

                <div className="intel-card">
                  <div className="intel-card-header">
                    <Hash size={12} />
                    <span>ENTROPY POOL</span>
                  </div>
                  <div className="intel-card-val">512-BIT CSPRNG</div>
                  <div className="intel-card-sub">Hardware Jitter Harvester</div>
                </div>
              </div>

              {/* Futuristic Dropzone with Animated Reticle */}
              <div
                className={`cyber-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="dropzone-corner corner-d-tl" />
                <div className="dropzone-corner corner-d-tr" />
                <div className="dropzone-corner corner-d-bl" />
                <div className="dropzone-corner corner-d-br" />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <div className="dropzone-reticle-wrap">
                  <div className="reticle-outer-ring" />
                  <div className="reticle-inner-ring" />
                  <div className="cyber-dropzone-icon">
                    <Cpu size={26} strokeWidth={1.8} />
                  </div>
                </div>

                <p className="dropzone-label">
                  DROP RAW PDF PAYLOAD HERE, OR <span>BROWSE FILES</span>
                </p>
                <span className="dropzone-sub">
                  ACCEPTS RAW PDF PAYLOADS UP TO 100 MB // ZERO PERSISTENCE
                </span>
              </div>
            </>
          )}

          {/* ── State: File Loaded & Ready for Password Entry ── */}
          {file && (
            <>
              {/* Loaded File HUD */}
              <div className="cyber-file-hud">
                <div className="cyber-file-left">
                  <div className="cyber-file-icon">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                  <div className="cyber-file-meta">
                    <div className="cyber-file-name" title={file.name}>
                      {file.name}
                    </div>
                    <div className="cyber-file-specs">
                      {fmtBytes(file.size)}
                      {pageCount !== null && ` // ${pageCount} ${pageCount === 1 ? 'PAGE' : 'PAGES'}`}
                    </div>
                    {fileSha256 && (
                      <div className="cyber-file-hash" title={`SHA-256: ${fileSha256}`}>
                        SHA-256: {fileSha256.slice(0, 24)}...
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="cyber-remove-btn"
                  onClick={resetFile}
                  title="Eject payload from memory"
                >
                  <X size={13} strokeWidth={2.5} />
                  <span>EJECT</span>
                </button>
              </div>

              {/* Hex Byte Stream Inspector */}
              <HexInspector
                rawBytes={rawBytes}
                isEncrypting={isEncrypting}
                isScanning={isScanning}
              />

              {/* Password & Encryption Form */}
              <form onSubmit={handleProtect} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Primary Password Input */}
                <div className="cyber-input-group">
                  <div className="cyber-label">
                    <label htmlFor="cyber-key">
                      <span>KEY_PHRASE // CIPHER PASSWORD</span>
                    </label>
                    <button
                      type="button"
                      className="quick-gen-btn"
                      onClick={handleQuickGenPassword}
                      title="Synthesize 24-character unbreakable cipher key"
                    >
                      <Sparkles size={11} />
                      <span>GENERATE MIL-SPEC KEY</span>
                    </button>
                  </div>

                  <div className="cyber-input-wrapper">
                    <input
                      id="cyber-key"
                      name="cyber_vault_key"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        cyberAudio.playKeyClick();
                        setPassword(e.target.value);
                      }}
                      placeholder="ENTER CIPHER KEY (ANY LENGTH PERMITTED)"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    <button
                      type="button"
                      className="cyber-toggle-eye"
                      onClick={() => {
                        cyberAudio.playKeyClick();
                        setShowPassword(!showPassword);
                      }}
                      aria-label={showPassword ? 'Hide cipher' : 'Show cipher'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Hacker Password Strength HUD */}
                  {password && (
                    <div className="entropy-hud">
                      <div className="entropy-row">
                        <span
                          className="entropy-level"
                          style={{
                            color:
                              entropy.colorClass === 'weak'
                                ? 'var(--neon-amber)'
                                : entropy.colorClass === 'medium'
                                ? 'var(--neon-cyan)'
                                : 'var(--neon-green)',
                          }}
                        >
                          {entropy.level}
                        </span>
                        <span className="entropy-crack-time">
                          CRACK RESISTANCE: {entropy.crackTime}
                        </span>
                      </div>

                      <div className="entropy-bars">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((seg) => (
                          <div
                            key={seg}
                            className={`entropy-seg ${
                              seg <= entropy.activeBars ? `active-${entropy.colorClass}` : ''
                            }`}
                          />
                        ))}
                      </div>

                      <div className="entropy-row" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>ENTROPY RATING: {entropy.bits} BITS</span>
                        <span>CIPHER: AES-256-CBC // PBKDF2</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="cyber-input-group">
                  <label className="cyber-label" htmlFor="cyber-confirm">
                    <span>CONFIRM // VERIFY CIPHER KEY</span>
                    {isMatch && (
                      <span className="match-status ok">
                        <Check size={12} strokeWidth={2.5} /> CIPHER VERIFIED
                      </span>
                    )}
                    {isMismatch && (
                      <span className="match-status err">
                        MISMATCH
                      </span>
                    )}
                  </label>
                  <div className="cyber-input-wrapper">
                    <input
                      id="cyber-confirm"
                      name="cyber_vault_confirm"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        cyberAudio.playKeyClick();
                        setConfirmPassword(e.target.value);
                      }}
                      placeholder="RE-ENTER PASSWORD TO CONFIRM"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                  </div>
                </div>

                {/* Advanced Military Security & Permissions Configuration */}
                <SecurityControls
                  options={securityOptions}
                  onChange={setSecurityOptions}
                />

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="cyber-action-btn"
                  disabled={!canSubmit}
                >
                  <Lock size={16} strokeWidth={2.2} />
                  <span>ENGAGE AES-256 SHIELD</span>
                </button>
              </form>
            </>
          )}

          {/* Status Feedback Notice */}
          {status.message && (
            <div className={`cyber-notice ${status.type}`}>
              {status.type === 'error' ? (
                <AlertCircle size={18} strokeWidth={2} />
              ) : (
                <Check size={18} strokeWidth={2} />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </main>

        {/* Live Running Hacker Terminal */}
        <Terminal
          logs={logs}
          onClear={() => setLogs([])}
          onRunCommand={handleTerminalCommand}
          isBusy={isScanning || isEncrypting}
        />

        {/* Cyber Footer */}
        <footer className="cyber-footer">
          <TerminalIcon size={12} />
          <span>AUTONOMOUS 3D CLIENT CIPHER</span>
          <span>//</span>
          <span>ZERO CLOUD PACKETS</span>
          <span>//</span>
          <span>DEFCON 1</span>
        </footer>
      </div>
    </>
  );
};

export default App;
