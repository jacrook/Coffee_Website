import { useEffect, useState } from 'react';
import { NotecardType } from '../types';
import { EncoreGrindTable } from './EncoreGrindTable';
import { V60Recipe } from './V60Recipe';

interface NotecardOverlayProps {
  isOpen: boolean;
  notecardType: NotecardType;
  onClose: () => void;
}

export function NotecardOverlay({ isOpen, notecardType, onClose }: NotecardOverlayProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger animation on mount/unmount
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`notecard-overlay ${isMounted ? 'open' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        opacity: isMounted ? 1 : 0,
        transition: 'opacity 300ms ease',
        pointerEvents: isMounted ? 'auto' : 'none',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notecard-title"
    >
      <div
        className="notecard-content"
        style={{
          backgroundColor: notecardType === 'encore' ? '#ADD8E6' : '#f5f0e6',
          backgroundImage: notecardType === 'encore' ? 'none' : 'url(/notecard.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: 'clamp(24px, 5vw, 40px)',
          width: 'clamp(300px, 70vw, 650px)',
          maxWidth: '90%',
          maxHeight: '80%',
          overflowY: 'auto',
          position: 'relative',
          transform: isMounted ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close notecard"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(61, 52, 43, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3d342b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Title */}
        <h2
          id="notecard-title"
          style={{
            fontFamily: "'expositionmedium', cursive",
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 'normal',
            color: '#1a3a3a',
            marginBottom: '1.5rem',
            marginTop: '0.5rem',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          {notecardType === 'encore' ? 'Encore Grind Settings' : 'V60 Recipe'}
        </h2>

        {/* Content */}
        <div
          style={{
            padding: '0 8px',
          }}
        >
          {notecardType === 'encore' ? <EncoreGrindTable /> : <V60Recipe />}
        </div>
      </div>
    </div>
  );
}
