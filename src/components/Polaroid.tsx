import { useDraggable } from '@dnd-kit/core';
import type { Polaroid } from '../types';

interface PolaroidProps {
  polaroid: Polaroid;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  containerBounds?: { width: number; height: number };
}

/**
 * Calculate caption font size based on text length
 * Returns smaller font size for long captions to prevent clipping
 */
function getCaptionFontSize(caption: string, polaroidWidth: number): string {
  // Available width for text (minus padding on both sides)
  const availableWidth = polaroidWidth - 32; // 16px padding on each side

  // Estimate characters per line at 12px Courier New uppercase with letter-spacing
  // Rough estimate: ~25 characters per line for 200-280px width
  const charsPerLine = Math.floor(availableWidth / 9); // ~9px per char at 12px

  // Estimate line count
  const estimatedLines = Math.ceil(caption.length / charsPerLine);

  // Adjust font size based on line count
  if (estimatedLines <= 2) {
    return '12px'; // Default size
  } else if (estimatedLines === 3) {
    return '11px'; // Slightly smaller for 3 lines
  } else {
    return '10px'; // Smaller for 4+ lines
  }
}

export function Polaroid({
  polaroid,
  isDragging = false,
  onDragEnd,
}: PolaroidProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: polaroid.id,
    disabled: !onDragEnd,
  });

  // Combine stored position with drag delta
  const x = polaroid.x + (transform?.x ?? 0);
  const y = polaroid.y + (transform?.y ?? 0);

  // Calculate polaroid frame dimensions (white border)
  const framePadding = 16;
  const imageWidth = polaroid.width - framePadding * 2;
  const imageHeight = polaroid.height - framePadding * 2 - 40; // Extra space for caption

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`polaroid ${isDragging ? 'is-dragging' : ''}`}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${polaroid.width}px`,
        height: `${polaroid.height}px`,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${polaroid.rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: polaroid.zIndex,
        backgroundColor: 'white',
        boxShadow: `
          0 4px 6px rgba(0, 0, 0, 0.1),
          0 10px 20px rgba(0, 0, 0, 0.15),
          inset 0 0 0 1px rgba(0, 0, 0, 0.05)
        `,
        borderRadius: '2px',
        padding: `${framePadding}px ${framePadding}px ${framePadding + 40}px`,
        cursor: onDragEnd ? 'grab' : 'default',
        userSelect: 'none',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        willChange: isDragging ? 'transform' : 'auto',
        ...(isDragging && {
          cursor: 'grabbing',
          boxShadow: `
            0 8px 12px rgba(0, 0, 0, 0.15),
            0 20px 40px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(0, 0, 0, 0.05)
          `,
        }),
      } as React.CSSProperties}
    >
      {/* Image area */}
      <div
        style={{
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          backgroundColor: '#f0f0f0',
          backgroundImage: polaroid.imageUrl
            ? `url(${polaroid.imageUrl})`
            : 'linear-gradient(135deg, #e0e0e0 25%, #f0f0f0 25%, #f0f0f0 50%, #e0e0e0 50%, #e0e0e0 75%, #f0f0f0 75%)',
          backgroundSize: polaroid.imageUrl ? 'cover' : '20px 20px',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {!polaroid.imageUrl && (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      {/* Caption */}
      {polaroid.caption && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: `${framePadding}px`,
            right: `${framePadding}px`,
            textAlign: 'center',
            fontFamily: '"Courier New", monospace',
            fontSize: getCaptionFontSize(polaroid.caption, polaroid.width),
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: '1.3',
          }}
        >
          {polaroid.caption}
        </div>
      )}
    </div>
  );
}
