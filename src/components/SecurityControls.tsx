import React, { useState } from 'react';
import { Sliders, Shield, FileX, Printer, Copy, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { cyberAudio } from '../audio';

export interface SecurityOptions {
  allowPrinting: boolean;
  allowCopying: boolean;
  stripMetadata: boolean;
  cipherSpec: 'AES-256-R6';
}

interface SecurityControlsProps {
  options: SecurityOptions;
  onChange: (options: SecurityOptions) => void;
}

export const SecurityControls: React.FC<SecurityControlsProps> = ({
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (key: keyof SecurityOptions) => {
    cyberAudio.playKeyClick();
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  // Calculate simulated permission bitmask in hex
  let bitmask = 0xfffff0c0;
  if (!options.allowPrinting) bitmask &= ~0x00000004;
  if (!options.allowCopying) bitmask &= ~0x00000010;
  const bitmaskHex = '0x' + (bitmask >>> 0).toString(16).toUpperCase();

  return (
    <div className="security-controls-panel">
      <button
        type="button"
        className="security-controls-toggle"
        onClick={() => {
          cyberAudio.playKeyClick();
          setIsOpen(!isOpen);
        }}
      >
        <div className="security-toggle-left">
          <Sliders size={13} className="neon-cyan-text" />
          <span>CIPHER_PARAMS // PERMISSIONS BITMASK &amp; METADATA</span>
        </div>
        <div className="security-toggle-right">
          <span className="bitmask-tag">{bitmaskHex}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isOpen && (
        <div className="security-controls-body">
          <div className="security-param-grid">
            {/* Strip Metadata */}
            <div
              className={`security-param-card ${options.stripMetadata ? 'active' : ''}`}
              onClick={() => toggleOption('stripMetadata')}
              role="button"
              tabIndex={0}
            >
              <div className="param-card-icon">
                <FileX size={14} />
              </div>
              <div className="param-card-content">
                <div className="param-title">METADATA SCRUBBING</div>
                <div className="param-desc">Wipe Author, Producer &amp; Timestamp tags</div>
              </div>
              <div className="param-card-check">
                {options.stripMetadata ? <CheckSquare size={15} /> : <Square size={15} />}
              </div>
            </div>

            {/* High-Res Printing */}
            <div
              className={`security-param-card ${options.allowPrinting ? 'active' : ''}`}
              onClick={() => toggleOption('allowPrinting')}
              role="button"
              tabIndex={0}
            >
              <div className="param-card-icon">
                <Printer size={14} />
              </div>
              <div className="param-card-content">
                <div className="param-title">HIGH-RES PRINTING</div>
                <div className="param-desc">Allow authorized user document print</div>
              </div>
              <div className="param-card-check">
                {options.allowPrinting ? <CheckSquare size={15} /> : <Square size={15} />}
              </div>
            </div>

            {/* Copy / Content Extraction */}
            <div
              className={`security-param-card ${options.allowCopying ? 'active' : ''}`}
              onClick={() => toggleOption('allowCopying')}
              role="button"
              tabIndex={0}
            >
              <div className="param-card-icon">
                <Copy size={14} />
              </div>
              <div className="param-card-content">
                <div className="param-title">CONTENT EXTRACTION</div>
                <div className="param-desc">Allow clipboard copy &amp; screen reading</div>
              </div>
              <div className="param-card-check">
                {options.allowCopying ? <CheckSquare size={15} /> : <Square size={15} />}
              </div>
            </div>

            {/* Cipher Standard Specs */}
            <div className="security-param-card locked">
              <div className="param-card-icon">
                <Shield size={14} />
              </div>
              <div className="param-card-content">
                <div className="param-title">CIPHER STANDARD</div>
                <div className="param-desc">AES-256 (Revision 6 ISO 32000-2)</div>
              </div>
              <span className="param-locked-badge">MIL-SPEC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
