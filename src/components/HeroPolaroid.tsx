import { Polaroid } from './Polaroid';
import type { Polaroid as PolaroidType } from '../types';

interface HeroPolaroidProps {
  polaroid: PolaroidType;
  isDragging?: boolean;
  containerBounds?: { width: number; height: number };
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

export function HeroPolaroid({
  polaroid,
  isDragging,
  containerBounds,
  onDragStart,
  onDragEnd,
}: HeroPolaroidProps) {
  return (
    <Polaroid
      polaroid={polaroid}
      isDragging={isDragging}
      containerBounds={containerBounds}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}
