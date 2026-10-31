import React from 'react';
import { CyberModal3D } from './CyberModal3D';
import { CyberRadarScanner } from './CyberRadarScanner';
import { CipherLockVault } from './CipherLockVault';
import { HexInspector } from './HexInspector';

interface CyberProcessModal3DProps {
  isScanning: boolean;
  scanStep: number;
  isEncrypting: boolean;
  encryptStep: number;
  rawBytes: Uint8Array | null;
  fileName?: string;
}

export const CyberProcessModal3D: React.FC<CyberProcessModal3DProps> = ({
  isScanning,
  scanStep,
  isEncrypting,
  encryptStep,
  rawBytes,
  fileName,
}) => {
  const isOpen = isScanning || isEncrypting;
  if (!isOpen) return null;

  const title = isScanning
    ? 'IN-MEMORY PAYLOAD HEURISTIC SCAN'
    : 'ENGAGING MIL-SPEC AES-256 CIPHER PIPELINE';

  const badge = isScanning ? 'STAGE 0' + scanStep + '/04' : 'STAGE 0' + encryptStep + '/06';

  return (
    <CyberModal3D isOpen={isOpen} title={title} badge={badge} width="680px">
      <div className="process-modal-3d-content">
        {/* State 1: Scanning Animation */}
        {isScanning && <CyberRadarScanner step={scanStep} fileName={fileName} />}

        {/* State 2: Encrypting Animation */}
        {isEncrypting && <CipherLockVault step={encryptStep} />}

        {/* Live Embedded 3D Hex Stream Scrambler */}
        <div className="process-hex-wrap-3d">
          <HexInspector
            rawBytes={rawBytes}
            isScanning={isScanning}
            isEncrypting={isEncrypting}
          />
        </div>
      </div>
    </CyberModal3D>
  );
};
