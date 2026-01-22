import { type ReactNode } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children?: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, className = '', children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
          </div>
        )}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
