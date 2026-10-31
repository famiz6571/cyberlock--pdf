import React, { useState, useEffect } from 'react';
import { Binary, RefreshCw, Cpu } from 'lucide-react';

interface HexInspectorProps {
  rawBytes?: Uint8Array | null;
  isEncrypting?: boolean;
  isScanning?: boolean;
}

interface HexRow {
  offset: string;
  bytes: string[];
  ascii: string;
}

export const HexInspector: React.FC<HexInspectorProps> = ({
  rawBytes,
  isEncrypting = false,
  isScanning = false,
}) => {
  const [rows, setRows] = useState<HexRow[]>([]);
  const [scrambleTick, setScrambleTick] = useState(0);

  // Generate or parse bytes into 5 rows of 16 bytes
  useEffect(() => {
    const rowList: HexRow[] = [];
    const totalRows = 5;
    const bytesPerRow = 16;

    for (let r = 0; r < totalRows; r++) {
      const offsetNum = r * bytesPerRow;
      const offsetStr = offsetNum.toString(16).padStart(8, '0').toUpperCase();
      const bytes: string[] = [];
      let ascii = '';

      for (let c = 0; c < bytesPerRow; c++) {
        const index = offsetNum + c;
        let byteVal: number;

        if (isEncrypting || isScanning) {
          // Mutating cipher bytes during crypto execution
          byteVal = Math.floor(Math.random() * 256);
        } else if (rawBytes && index < rawBytes.length) {
          byteVal = rawBytes[index];
        } else {
          // Default cool cryptographic preamble
          const defaultPreamble = [
            0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a, 0x31,
            0x20, 0x30, 0x20, 0x6f, 0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x2f, 0x54, 0x79, 0x70, 0x65, 0x2f, 0x43,
            0x61, 0x74, 0x61, 0x6c, 0x6f, 0x67, 0x2f, 0x50, 0x61, 0x67, 0x65, 0x73, 0x20, 0x32, 0x20, 0x30,
            0x20, 0x52, 0x2f, 0x45, 0x6e, 0x63, 0x72, 0x79, 0x70, 0x74, 0x20, 0x33, 0x20, 0x30, 0x20, 0x52,
            0x3e, 0x3e, 0x0a, 0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a, 0x0a, 0x33, 0x20, 0x30, 0x20, 0x6f, 0x62,
          ];
          byteVal = defaultPreamble[index % defaultPreamble.length];
        }

        bytes.push(byteVal.toString(16).padStart(2, '0').toUpperCase());
        ascii += byteVal >= 32 && byteVal <= 126 ? String.fromCharCode(byteVal) : '.';
      }

      rowList.push({ offset: offsetStr, bytes, ascii });
    }

    setRows(rowList);
  }, [rawBytes, isEncrypting, isScanning, scrambleTick]);

  // Periodic scramble effect when encrypting or scanning
  useEffect(() => {
    if (!isEncrypting && !isScanning) return;
    const interval = setInterval(() => {
      setScrambleTick((prev) => prev + 1);
    }, 110);
    return () => clearInterval(interval);
  }, [isEncrypting, isScanning]);

  return (
    <div className="hex-inspector-panel">
      <div className="hex-header">
        <div className="hex-header-title">
          <Binary size={13} className="neon-cyan-text" />
          <span>HEX_STREAM // IN-MEMORY DUMP</span>
        </div>
        <div className="hex-header-badge">
          <Cpu size={11} />
          <span>{isEncrypting ? 'MUTATING [AES-256]' : isScanning ? 'XREF PARSING' : 'RAW BYTES'}</span>
        </div>
      </div>

      <div className="hex-table">
        <div className="hex-legend">
          <span className="hex-col-offset">OFFSET</span>
          <span className="hex-col-bytes">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
          <span className="hex-col-ascii">ASCII</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className={`hex-row ${isEncrypting ? 'row-scrambling' : ''}`}>
            <span className="hex-offset">{row.offset}</span>
            <div className="hex-byte-group">
              {row.bytes.slice(0, 8).map((b, bi) => (
                <span
                  key={bi}
                  className={`hex-byte ${isEncrypting && bi % 2 === 0 ? 'highlight-cyan' : ''}`}
                >
                  {b}
                </span>
              ))}
              <span className="hex-spacer"></span>
              {row.bytes.slice(8, 16).map((b, bi) => (
                <span
                  key={bi + 8}
                  className={`hex-byte ${isEncrypting && bi % 2 === 1 ? 'highlight-green' : ''}`}
                >
                  {b}
                </span>
              ))}
            </div>
            <span className="hex-ascii">{row.ascii}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
