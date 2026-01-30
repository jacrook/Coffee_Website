import type { BoardMetrics, Tile } from '../types';

/**
 * Snap a position to the nearest groove and constrain to board bounds
 * Uses board-relative scale factor (not window-relative)
 */
export function snapToGroove(
  x: number,
  y: number,
  tile: Pick<Tile, 'width' | 'fontSizePx'>,
  metrics: BoardMetrics
): { x: number; y: number } {
  const { width: boardWidth, height: boardHeight, rowHeightPx, grooveOffsetPx } = metrics;

  // Calculate tile height (1.2x font size)
  const tileHeight = tile.fontSizePx * 1.2;

  // Find nearest groove row
  const row = Math.round((y - grooveOffsetPx) / rowHeightPx);

  // Snap Y to groove
  let snappedY = row * rowHeightPx + grooveOffsetPx;

  // Constrain Y to board bounds
  snappedY = Math.max(0, Math.min(snappedY, boardHeight - tileHeight));

  // Constrain X to board bounds
  let snappedX = Math.max(0, Math.min(x, boardWidth - tile.width));

  return { x: snappedX, y: snappedY };
}

/**
 * Clamp a position to board bounds (without snapping to groove)
 */
export function clampToBounds(
  x: number,
  y: number,
  tile: Pick<Tile, 'width' | 'fontSizePx'>,
  metrics: BoardMetrics
): { x: number; y: number } {
  const { width: boardWidth, height: boardHeight } = metrics;
  const tileHeight = tile.fontSizePx * 1.2;

  return {
    x: Math.max(0, Math.min(x, boardWidth - tile.width)),
    y: Math.max(0, Math.min(y, boardHeight - tileHeight)),
  };
}
