import { useDraggable } from '@dnd-kit/core';
import type { Tile } from '../../types';

interface TileProps {
  tile: Tile;
  isDragging?: boolean;
  index?: number;
}

export function Tile({ tile, index = 0 }: TileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
  });

  // Combine the stored tile position with the drag delta
  const x = tile.x + (transform?.x ?? 0);
  const y = tile.y + (transform?.y ?? 0);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`tile cursor-grab active:cursor-grabbing ${
        isDragging ? 'is-dragging' : ''
      }`}
      style={{
        fontFamily: '"LetterboardWhite Pixillo", sans-serif',
        color: 'white',
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${tile.width}px`,
        height: `${tile.fontSizePx * 1.2}px`,
        fontSize: `${tile.fontSizePx}px`,
        lineHeight: `${tile.fontSizePx * 1.2}px`,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        // CSS custom properties for animation
        '--tile-x': `${tile.x}px`,
        '--tile-y': `${tile.y}px`,
        // Stagger animations
        animationDelay: `${index * 30}ms`,
        // Transform-based positioning for performance
        transform: `translate3d(${x}px, ${y}px, 0)`,
        // Will-change for performance during drag
        willChange: isDragging ? 'transform' : 'auto',
        // Dragging state
        ...(isDragging && {
          zIndex: 100,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        }),
        // Scale effect during drag (using transform)
        ...(isDragging && {
          transform: `translate3d(${x}px, ${y}px, 0) scale(1.1)`,
        }),
        // Transition for smooth snap (disabled during drag)
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        // Embossed text effect (from prototype)
        textShadow: `
          1px 1px 0 rgba(255, 255, 255, 0.1),
          -1px -1px 0 rgba(0, 0, 0, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.5)
        `,
        pointerEvents: 'auto',
        userSelect: 'none',
        touchAction: 'none', // Important for touch drag
      } as React.CSSProperties}
    >
      {tile.char}
    </div>
  );
}
