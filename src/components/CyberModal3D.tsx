import React from 'react';
import { X } from 'lucide-react';
import { cyberAudio } from '../audio';

interface CyberModal3DProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  badge?: string;
  children: React.ReactNode;
  width?: string;
}

export const CyberModal3D: React.FC<CyberModal3DProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  children,
  width = '640px',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-3d">
      <div
        className="modal-card-3d"
        style={{
          maxWidth: width,
        }}
      >
        {/* Floating Corner Reticles */}
        <div className="corner-bracket-3d corner-3d-tl" />
        <div className="corner-bracket-3d corner-3d-tr" />
        <div className="corner-bracket-3d corner-3d-bl" />
        <div className="corner-bracket-3d corner-3d-br" />

        {/* Modal Header Bar */}
        {(title || onClose) && (
          <div className="modal-header-3d">
            <div className="modal-title-left">
              {badge && <span className="modal-badge-3d">{badge}</span>}
              {title && <span className="modal-title-text-3d">{title}</span>}
            </div>
            {onClose && (
              <button
                type="button"
                className="modal-close-btn-3d"
                onClick={() => {
                  cyberAudio.playKeyClick();
                  onClose();
                }}
                aria-label="Close modal"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="modal-body-3d">{children}</div>
      </div>
    </div>
  );
};
