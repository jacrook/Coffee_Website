import { useEffect, useState } from 'react';
import { ButcherPaperPanel } from './ButcherPaperPanel';
import { GalleryPanel } from './GalleryPanel';
import type { PanelType, Polaroid as PolaroidType, NotecardType } from '../types';

interface InterstitialPanelProps {
  activePanel: PanelType;
  galleryPolaroids: PolaroidType[];
  containerBounds?: { width: number; height: number };
  onClose?: () => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  activeNotecard?: NotecardType;
  onNotecardOpen?: (notecardType: 'encore' | 'v60') => void;
  onNotecardClose?: () => void;
}

export function InterstitialPanel({
  activePanel,
  galleryPolaroids,
  containerBounds,
  onClose,
  onDragStart,
  onDragEnd,
  activeNotecard,
  onNotecardOpen,
  onNotecardClose,
}: InterstitialPanelProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="interstitial-panel"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 20,
        pointerEvents: 'auto',
      }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="panel-close-button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#00FFFF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Render appropriate panel based on activePanel */}
      {activePanel === 'gallery' ? (
        <GalleryPanel
          polaroids={galleryPolaroids}
          isMounted={isMounted}
          containerBounds={containerBounds}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ) : (
        <ButcherPaperPanel
          panelType={activePanel}
          isMounted={isMounted}
          activeNotecard={activeNotecard}
          onNotecardOpen={onNotecardOpen}
          onNotecardClose={onNotecardClose}
        />
      )}
    </div>
  );
}
