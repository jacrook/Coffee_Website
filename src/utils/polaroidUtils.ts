/**
 * Polaroid utility functions
 */

/**
 * Calculate the rotated bounding box dimensions for a polaroid
 * This ensures corners don't clip when rotated
 *
 * @param width - Original width of the polaroid
 * @param height - Original height of the polaroid
 * @param rotationDegrees - Rotation angle in degrees
 * @returns The rotated bounding box dimensions
 */
export function getRotatedBounds(
  width: number,
  height: number,
  rotationDegrees: number
): { width: number; height: number } {
  const angleRad = (Math.abs(rotationDegrees) * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Rotated bounding box formula:
  // w2 = |w*cosθ| + |h*sinθ|
  // h2 = |w*sinθ| + |h*cosθ|
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);

  return { width: rotatedWidth, height: rotatedHeight };
}
