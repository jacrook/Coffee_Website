export type HeadingLevel = 'H1' | 'H2' | 'H3' | 'H4';

export interface Heading {
  id: string;
  level: HeadingLevel;
  text: string;
}

export interface Tile {
  id: string;
  headingId: string;
  headingLevel: HeadingLevel;
  index: number;
  char: string;
  x: number;
  y: number;
  width: number;
  fontSizePx: number;
  manuallyMoved: boolean;
}

export interface BoardMetrics {
  width: number;
  height: number;
  rowHeightPx: number;
  grooveOffsetPx: number;
  scaleFactor: number;
}

// Panel types for interstitial panels
export type PanelType = 'hero' | 'journey' | 'craft' | 'gallery' | 'contact';

// Notecard types for Craft panel drilldowns
export type NotecardType = 'encore' | 'v60' | null;

// Polaroid for gallery and hero
export interface Polaroid {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  imageUrl?: string;
  caption?: string;
  zIndex: number;
}

// Panel state management
export interface PanelState {
  activePanel: PanelType;
  isPanelOpen: boolean;
  heroPolaroids: Polaroid[];
  galleryPolaroids: Polaroid[];
}

// Craft panel notecard state
export interface CraftPanelState {
  activeNotecard: NotecardType;
}

export interface LetterboardState {
  fontReady: boolean;
  boardMetrics: BoardMetrics | null;
  headings: Heading[];
  tiles: Tile[];
  panel: PanelState;
  craftPanel: CraftPanelState;
  maxZIndex: number; // Track max z-index for bring-to-front
}
