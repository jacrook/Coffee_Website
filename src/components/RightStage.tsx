import { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { HeroPolaroid } from './HeroPolaroid';
import { InterstitialPanel } from './InterstitialPanel';
import type { PanelType, Polaroid as PolaroidType, NotecardType } from '../types';
import { getRotatedBounds } from '../utils/polaroidUtils';

interface RightStageProps {
  activePanel: PanelType;
  isPanelOpen: boolean;
  heroPolaroids: PolaroidType[];
  galleryPolaroids: PolaroidType[];
  onClosePanel?: () => void;
  onPolaroidDragEnd?: (id: string, x: number, y: number) => void;
  onPolaroidBringToFront?: (id: string) => void;
  onRegenerateGalleryPolaroids?: (width: number, height: number) => void;
  activeNotecard?: NotecardType;
  onNotecardOpen?: (notecardType: 'encore' | 'v60') => void;
  onNotecardClose?: () => void;
}

export function RightStage({
  activePanel,
  isPanelOpen,
  heroPolaroids,
  galleryPolaroids,
  onClosePanel,
  onPolaroidDragEnd,
  onPolaroidBringToFront,
  onRegenerateGalleryPolaroids,
  activeNotecard,
  onNotecardOpen,
  onNotecardClose,
}: RightStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState({ width: 800, height: 600 });
  const [heroDraggedId, setHeroDraggedId] = useState<string | null>(null);
  const previousBoundsRef = useRef<{ width: number; height: number } | null>(null);

  // Measure container bounds
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({ width: rect.width, height: rect.height });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Regenerate gallery polaroids when bounds are measured and gallery is active
  useEffect(() => {
    if (!onRegenerateGalleryPolaroids) return;

    const isGalleryActive = activePanel === 'gallery' && isPanelOpen;
    const boundsChanged =
      !previousBoundsRef.current ||
      previousBoundsRef.current.width !== containerBounds.width ||
      previousBoundsRef.current.height !== containerBounds.height;

    if (isGalleryActive && boundsChanged) {
      onRegenerateGalleryPolaroids(containerBounds.width, containerBounds.height);
      previousBoundsRef.current = containerBounds;
    }
  }, [containerBounds, activePanel, isPanelOpen, onRegenerateGalleryPolaroids]);

  // Handle drag start for polaroids
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setHeroDraggedId(active.id as string);
    if (onPolaroidBringToFront) {
      onPolaroidBringToFront(active.id as string);
    }
  }, [onPolaroidBringToFront]);

  // Handle drag end for polaroids
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    setHeroDraggedId(null);

    const polaroid = [...heroPolaroids, ...galleryPolaroids].find(p => p.id === active.id);

    if (!polaroid || !onPolaroidDragEnd) return;

    // Calculate new position
    const newX = polaroid.x + delta.x;
    const newY = polaroid.y + delta.y;

    // Get rotated bounds to ensure the entire polaroid stays inside
    const rotatedBounds = getRotatedBounds(polaroid.width, polaroid.height, polaroid.rotation);

    // Clamp to container bounds using rotated dimensions
    const clampedX = Math.max(0, Math.min(newX, containerBounds.width - rotatedBounds.width));
    const clampedY = Math.max(0, Math.min(newY, containerBounds.height - rotatedBounds.height));

    onPolaroidDragEnd(polaroid.id, clampedX, clampedY);
  }, [heroPolaroids, galleryPolaroids, containerBounds, onPolaroidDragEnd]);

  return (
    <div
      ref={containerRef}
      className="right-stage"
      style={{
        position: 'absolute',
        right: 0,
        top: '45px',
        width: '80%',
        height: 'calc(100% - 45px)',
        zIndex: 3, // Below tiles (z-15) but above background (z-1)
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Hero Polaroids - shown when no panel is open */}
      {!isPanelOpen && (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
            {heroPolaroids.map((polaroid) => (
              <HeroPolaroid
                key={polaroid.id}
                polaroid={polaroid}
                isDragging={heroDraggedId === polaroid.id}
                containerBounds={containerBounds}
                onDragStart={(id) => onPolaroidBringToFront?.(id)}
                onDragEnd={onPolaroidDragEnd}
              />
            ))}
          </div>
        </DndContext>
      )}

      {/* Interstitial Panel (z-20) - shown when panel is open */}
      {isPanelOpen && (
        <InterstitialPanel
          activePanel={activePanel}
          galleryPolaroids={galleryPolaroids}
          containerBounds={containerBounds}
          onClose={onClosePanel}
          onDragStart={(id) => onPolaroidBringToFront?.(id)}
          onDragEnd={onPolaroidDragEnd}
          activeNotecard={activeNotecard}
          onNotecardOpen={onNotecardOpen}
          onNotecardClose={onNotecardClose}
        />
      )}
    </div>
  );
}
