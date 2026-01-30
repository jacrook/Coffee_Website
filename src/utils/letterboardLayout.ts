import type { Heading, HeadingLevel, Tile, BoardMetrics } from '../types';
import { computeTileWidth } from './textMeasurement';

// Spacing constants (em-relative, matching prototype)
const LETTER_SPACING_EM = 0.18;
const WORD_SPACING_EM = 0.85;

// Heading size system (clamp values: min rem, max rem, vw multiplier)
const HEADING_SIZES = {
  H1: { min: 5, max: 12, vw: 0.14 },
  H2: { min: 3, max: 8, vw: 0.10 },
  H3: { min: 2.5, max: 6, vw: 0.08 },
  H4: { min: 2, max: 5, vw: 0.06 },
} as const;

/**
 * Get font size for a heading level (returns px value)
 * Implements: clamp(min rem, vw * multiplier, max rem)
 */
export function getFontSizeForHeading(level: HeadingLevel, viewportWidthPx: number): number {
  const config = HEADING_SIZES[level];
  const vw = viewportWidthPx / 100;

  // clamp(min, value, max)
  const sizeVw = vw * config.vw;
  const sizeRem = Math.max(config.min, Math.min(sizeVw, config.max));

  // Convert rem to px (1rem = 16px)
  return sizeRem * 16;
}

/**
 * Get row index for a heading level
 * H1 → row 2
 * H2 → row 5
 * H3 → row 8
 * H4 → row 11
 */
export function getRowIndexForHeading(level: HeadingLevel): number {
  const rowMap = { H1: 2, H2: 5, H3: 8, H4: 11 };
  return rowMap[level];
}

/**
 * Layout all tiles for a single heading
 * Returns array of tiles with unified spacing
 */
export function layoutHeadingTiles(
  heading: Heading,
  boardMetrics: BoardMetrics,
  options: { fontFamily: string } = { fontFamily: '"LetterboardWhite Pixillo"' }
): Tile[] {
  const { id: headingId, level, text } = heading;
  const { width: boardWidth } = boardMetrics;

  const fontSize = getFontSizeForHeading(level, boardWidth);
  const rowIndex = getRowIndexForHeading(level);

  // Calculate Y position (snap to groove)
  const y = rowIndex * boardMetrics.rowHeightPx + boardMetrics.grooveOffsetPx;

  // Split text into words
  const words = text.split(' ');
  const tiles: Tile[] = [];
  let currentX = 0;

  // Calculate max width for unified spacing
  const charWidths: number[] = [];
  for (const char of text) {
    if (char === ' ') continue;
    const width = computeTileWidth(char, fontSize, options.fontFamily);
    charWidths.push(width);
  }

  const maxCharWidth = Math.max(...charWidths, fontSize * 0.6);
  const letterGapPx = LETTER_SPACING_EM * fontSize;
  const wordGapPx = WORD_SPACING_EM * fontSize;

  // Build tiles
  let charIndex = 0;
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];

    for (const char of word) {
      tiles.push({
        id: `${headingId}-${charIndex}`,
        headingId,
        headingLevel: level,
        index: charIndex,
        char,
        x: currentX,
        y,
        width: maxCharWidth,
        fontSizePx: fontSize,
        manuallyMoved: false,
      });

      currentX += maxCharWidth + letterGapPx;
      charIndex++;
    }

    // Add word gap (except for last word)
    if (wordIndex < words.length - 1) {
      currentX += wordGapPx;
    }
  }

  // Calculate total width and center the heading
  const totalWidth = currentX - letterGapPx;
  const startX = (boardWidth - totalWidth) / 2;

  // Adjust all tile positions
  return tiles.map((tile) => ({
    ...tile,
    x: tile.x + startX,
  }));
}
