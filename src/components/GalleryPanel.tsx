import { useState } from 'react';
import { Polaroid } from './Polaroid';
import type { Polaroid as PolaroidType } from '../types';
import { getPanelAnimationStyles } from '../utils/panelAnimation';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { getRotatedBounds } from '../utils/polaroidUtils';

interface GalleryPanelProps {
  polaroids: PolaroidType[];
  isMounted: boolean;
  containerBounds?: { width: number; height: number };
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

export function GalleryPanel({
  polaroids,
  isMounted,
  containerBounds,
  onDragStart,
  onDragEnd,
}: GalleryPanelProps) {
  const [localDraggedId, setLocalDraggedId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setLocalDraggedId(active.id as string);
    if (onDragStart) {
      onDragStart(active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setLocalDraggedId(null);

    const polaroid = polaroids.find(p => p.id === active.id);

    if (!polaroid || !onDragEnd || !containerBounds) return;

    // Calculate new position
    const newX = polaroid.x + delta.x;
    const newY = polaroid.y + delta.y;

    // Get rotated bounds to ensure the entire polaroid stays inside
    const rotatedBounds = getRotatedBounds(polaroid.width, polaroid.height, polaroid.rotation);

    // Clamp to container bounds using rotated dimensions
    const clampedX = Math.max(0, Math.min(newX, containerBounds.width - rotatedBounds.width));
    const clampedY = Math.max(0, Math.min(newY, containerBounds.height - rotatedBounds.height));

    onDragEnd(polaroid.id, clampedX, clampedY);
  };

  return (
    <div
      className="gallery-panel"
      style={{
        ...getPanelAnimationStyles(isMounted),
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
          {polaroids.map((polaroid) => (
            <Polaroid
              key={polaroid.id}
              polaroid={polaroid}
              isDragging={localDraggedId === polaroid.id}
              containerBounds={containerBounds}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
