/**
 * Text measurement utilities for letterboard tiles
 */

/**
 * Compute tile width using Canvas API for accurate text measurement
 * Returns width in pixels
 */
export function computeTileWidth(
  text: string,
  fontSizePx: number,
  fontFamily: string
): number {
  // Create a canvas element for measurement
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    // Fallback: rough estimate
    return text.length * fontSizePx * 0.6;
  }

  context.font = `${fontSizePx}px ${fontFamily}`;
  const metrics = context.measureText(text);
  return metrics.width;
}
