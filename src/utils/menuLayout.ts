import type { Heading, Tile, BoardMetrics } from '../types';
import { getFontSizeForHeading } from './letterboardLayout';
import { computeTileWidth } from './textMeasurement';

/**
 * Menu row system (separate from H1-H4 content rows):
 * Journey → row 5
 * Craft → row 7
 * Gallery → row 9
 * Contact → row 11
 */
const MENU_ROW_MAPPING: Record<string, number> = {
  'Journey': 5,
  'Craft': 7,
  'Gallery': 9,
  'Contact': 11,
};

/**
 * Get the menu row index for a menu item text
 */
export function getMenuRowIndex(menuText: string): number {
  return MENU_ROW_MAPPING[menuText] ?? 5;
}

/**
 * Layout menu tiles for the left 20% region
 * Creates a SINGLE tile per menu item (full word), not individual character tiles
 */
export function layoutMenuTiles(
  heading: Heading,
  boardMetrics: BoardMetrics,
  options: { fontFamily: string; menuColumnWidth: number } = {
    fontFamily: '"LetterboardWhite Pixillo"',
    menuColumnWidth: 0.2, // 20% of board width
  }
): Tile[] {
  const { id: headingId, level, text } = heading;
  const { width: boardWidth } = boardMetrics;

  const fontSize = getFontSizeForHeading(level, boardWidth);
  const menuRow = getMenuRowIndex(text);
  const y = menuRow * boardMetrics.rowHeightPx + boardMetrics.grooveOffsetPx;

  // Compute width for the full word
  const tileWidth = computeTileWidth(text, fontSize, options.fontFamily);

  // Calculate starting X position (left-aligned with padding)
  const padding = 16;
  const startX = padding;

  // Create a single tile for the entire menu word
  const tile: Tile = {
    id: `${headingId}-0`,
    headingId,
    headingLevel: level,
    index: 0,
    char: text, // Store full word in char
    x: startX,
    y,
    width: tileWidth,
    fontSizePx: fontSize,
    manuallyMoved: false,
  };

  return [tile];
}

/**
 * Check if a heading text is a menu item
 */
export function isMenuItem(headingText: string): boolean {
  return Object.keys(MENU_ROW_MAPPING).includes(headingText);
}
