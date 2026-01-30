import type { LetterboardState, BoardMetrics, Tile, Heading, PanelType, Polaroid, NotecardType } from '../types';
import { layoutHeadingTiles } from './letterboardLayout';
import { layoutMenuTiles, isMenuItem } from './menuLayout';
import { snapToGroove } from './snap';
import { generateGalleryPolaroids } from './polaroidLayout';

export type Action =
  | { type: 'FONT_READY' }
  | { type: 'BOARD_MEASURED'; metrics: BoardMetrics }
  | { type: 'ADD_HEADING'; heading: Omit<Heading, 'id'> }
  | { type: 'INIT_OR_REFLOW_LAYOUT' }
  | { type: 'DRAG_START'; tileId: string }
  | { type: 'DRAG_END'; tileId: string; x: number; y: number }
  // Panel actions
  | { type: 'PANEL_OPEN'; panelType: PanelType }
  | { type: 'PANEL_CLOSE' }
  | { type: 'GALLERY_GENERATE_POLAROIDS'; width: number; height: number }
  | { type: 'POLAROID_DRAG_END'; id: string; x: number; y: number }
  | { type: 'POLAROID_BRING_TO_FRONT'; id: string }
  // Notecard actions
  | { type: 'NOTECARD_OPEN'; notecardType: NotecardType }
  | { type: 'NOTECARD_CLOSE' };

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Layout all headings while preserving manually moved tiles
 */
function layoutAllHeadings(
  headings: Heading[],
  existingTiles: Tile[],
  boardMetrics: BoardMetrics
): Tile[] {
  // Create a map of manually moved tiles for quick lookup
  const manualTilesMap = new Map<string, Tile>();
  for (const tile of existingTiles) {
    if (tile.manuallyMoved) {
      manualTilesMap.set(tile.id, tile);
    }
  }

  // Layout all headings
  const newTiles: Tile[] = [];
  for (const heading of headings) {
    // Use menu layout for menu items, regular layout for others
    const headingTiles = isMenuItem(heading.text)
      ? layoutMenuTiles(heading, boardMetrics)
      : layoutHeadingTiles(heading, boardMetrics);

    // For each new tile, check if there's a manually moved version
    for (const newTile of headingTiles) {
      const manualTile = manualTilesMap.get(newTile.id);
      if (manualTile) {
        // Preserve manual position
        newTiles.push(manualTile);
      } else {
        // Use new position
        newTiles.push(newTile);
      }
    }
  }

  return newTiles;
}

export function letterboardReducer(state: LetterboardState, action: Action): LetterboardState {
  switch (action.type) {
    case 'FONT_READY':
      return { ...state, fontReady: true };

    case 'BOARD_MEASURED':
      return { ...state, boardMetrics: action.metrics };

    case 'ADD_HEADING': {
      const newHeading: Heading = {
        id: generateId(),
        ...action.heading,
      };

      // Don't clear existing tiles - add new heading tiles
      const newTiles = state.boardMetrics
        ? layoutAllHeadings(
            [...state.headings, newHeading],
            state.tiles,
            state.boardMetrics
          )
        : state.tiles;

      return {
        ...state,
        headings: [...state.headings, newHeading],
        tiles: newTiles,
      };
    }

    case 'INIT_OR_REFLOW_LAYOUT': {
      if (!state.boardMetrics || !state.fontReady) return state;

      const newTiles = layoutAllHeadings(
        state.headings,
        state.tiles,
        state.boardMetrics
      );

      return { ...state, tiles: newTiles };
    }

    case 'DRAG_START':
      return { ...state };

    case 'DRAG_END': {
      if (!state.boardMetrics) return state;

      const tile = state.tiles.find((t) => t.id === action.tileId);
      if (!tile) return state;

      // Snap position and mark as manually moved
      const snapped = snapToGroove(action.x, action.y, tile, state.boardMetrics);

      return {
        ...state,
        tiles: state.tiles.map((t) =>
          t.id === action.tileId
            ? { ...t, x: snapped.x, y: snapped.y, manuallyMoved: true }
            : t
        ),
      };
    }

    // Panel actions
    case 'PANEL_OPEN': {
      return {
        ...state,
        panel: {
          ...state.panel,
          activePanel: action.panelType,
          isPanelOpen: true,
        },
      };
    }

    case 'PANEL_CLOSE': {
      return {
        ...state,
        panel: {
          ...state.panel,
          activePanel: 'hero',
          isPanelOpen: false,
        },
      };
    }

    case 'GALLERY_GENERATE_POLAROIDS': {
      const polaroids = generateGalleryPolaroids(action.width, action.height);
      return {
        ...state,
        panel: {
          ...state.panel,
          galleryPolaroids: polaroids,
        },
        maxZIndex: Math.max(state.maxZIndex, ...polaroids.map(p => p.zIndex)),
      };
    }

    case 'POLAROID_DRAG_END': {
      // Clamp position to bounds (no groove snapping for polaroids)
      const updatePolaroid = (p: Polaroid) => {
        if (p.id !== action.id) return p;

        // Clamp to bounds
        const clampedX = Math.max(0, Math.min(action.x, 1200 - p.width)); // Assuming 1200px max width
        const clampedY = Math.max(0, Math.min(action.y, 800 - p.height)); // Assuming 800px max height

        return { ...p, x: clampedX, y: clampedY };
      };

      return {
        ...state,
        panel: {
          ...state.panel,
          heroPolaroids: state.panel.heroPolaroids.map(updatePolaroid),
          galleryPolaroids: state.panel.galleryPolaroids.map(updatePolaroid),
        },
      };
    }

    case 'POLAROID_BRING_TO_FRONT': {
      const newZIndex = state.maxZIndex + 1;

      const updatePolaroid = (p: Polaroid) =>
        p.id === action.id
          ? { ...p, zIndex: newZIndex }
          : p;

      return {
        ...state,
        panel: {
          ...state.panel,
          heroPolaroids: state.panel.heroPolaroids.map(updatePolaroid),
          galleryPolaroids: state.panel.galleryPolaroids.map(updatePolaroid),
        },
        maxZIndex: newZIndex,
      };
    }

    case 'NOTECARD_OPEN': {
      return {
        ...state,
        craftPanel: {
          ...state.craftPanel,
          activeNotecard: action.notecardType,
        },
      };
    }

    case 'NOTECARD_CLOSE': {
      return {
        ...state,
        craftPanel: {
          ...state.craftPanel,
          activeNotecard: null,
        },
      };
    }

    default:
      return state;
  }
}
