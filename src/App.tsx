import { useReducer, useCallback, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { LetterboardHero } from './components/letterboard/LetterboardHero';
import { TopBar } from './components/TopBar';
import { LeftMenuTiles } from './components/letterboard/LeftMenuTiles';
import { RightStage } from './components/RightStage';
import { letterboardReducer } from './utils/letterboardReducer';
import { createHeroPolaroids } from './utils/polaroidLayout';
import { preloadAllImages } from './utils/imagePreload';
import type { LetterboardState, BoardMetrics, PanelType } from './types';
import './App.css';

// Initial state with H1 title + menu headings (H2 level)
const initialState: LetterboardState = {
  fontReady: false,
  boardMetrics: null,
  headings: [
    { id: 'h1-1', level: 'H1', text: 'James Crook' },
    { id: 'menu-journey', level: 'H2', text: 'Journey' },
    { id: 'menu-craft', level: 'H2', text: 'Craft' },
    { id: 'menu-gallery', level: 'H2', text: 'Gallery' },
    { id: 'menu-contact', level: 'H2', text: 'Contact' },
  ],
  tiles: [],
  panel: {
    activePanel: 'hero',
    isPanelOpen: false,
    heroPolaroids: createHeroPolaroids(800, 600), // Initial placeholder, will be recalculated
    galleryPolaroids: [],
  },
  craftPanel: {
    activeNotecard: null,
  },
  maxZIndex: 100,
};

function App() {
  const [state, dispatch] = useReducer(letterboardReducer, initialState);
  const previousMetricsRef = useRef<BoardMetrics | null>(null);

  const handleFontReady = useCallback(() => {
    dispatch({ type: 'FONT_READY' });
  }, []);

  const handleBoardMeasured = useCallback((metrics: BoardMetrics) => {
    dispatch({ type: 'BOARD_MEASURED', metrics });
  }, []);

  // Trigger layout when both font and board are ready, or when metrics change (resize)
  useEffect(() => {
    if (!state.fontReady || !state.boardMetrics) return;

    const metricsChanged =
      !previousMetricsRef.current ||
      previousMetricsRef.current.width !== state.boardMetrics.width ||
      previousMetricsRef.current.height !== state.boardMetrics.height;

    if (metricsChanged || state.tiles.length === 0) {
      dispatch({ type: 'INIT_OR_REFLOW_LAYOUT' });
      previousMetricsRef.current = state.boardMetrics;
    }
  }, [state.fontReady, state.boardMetrics, state.tiles.length]);

  // Preload gallery and hero images when app mounts
  useEffect(() => {
    preloadAllImages().catch(err => {
      console.warn('Some images failed to preload:', err);
    });
  }, []);

  // Tile drag handlers
  const handleTileDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    // Check if this is a tile (starts with heading ID pattern)
    const tile = state.tiles.find((t) => t.id === active.id);
    if (tile) {
      dispatch({ type: 'DRAG_START', tileId: active.id as string });
    }
  }, [state.tiles]);

  const handleTileDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    // Check if this is a tile
    const tile = state.tiles.find((t) => t.id === active.id);
    if (tile) {
      // Calculate new position
      const newX = tile.x + delta.x;
      const newY = tile.y + delta.y;

      dispatch({ type: 'DRAG_END', tileId: tile.id, x: newX, y: newY });
    }
  }, [state.tiles]);

  // Panel handlers
  const handleMenuClick = useCallback((panelType: PanelType) => {
    dispatch({ type: 'PANEL_OPEN', panelType });

    // Initial gallery polaroid generation when gallery panel opens
    // Will be regenerated with accurate bounds by RightStage
    if (panelType === 'gallery' && state.boardMetrics) {
      const rightStageWidth = state.boardMetrics.width * 0.8;
      const rightStageHeight = state.boardMetrics.height;
      dispatch({ type: 'GALLERY_GENERATE_POLAROIDS', width: rightStageWidth, height: rightStageHeight });
    }
  }, [state.boardMetrics]);

  const handleRegenerateGalleryPolaroids = useCallback((width: number, height: number) => {
    dispatch({ type: 'GALLERY_GENERATE_POLAROIDS', width, height });
  }, []);

  const handleClosePanel = useCallback(() => {
    dispatch({ type: 'PANEL_CLOSE' });
  }, []);

  // Notecard handlers
  const handleNotecardOpen = useCallback((notecardType: 'encore' | 'v60') => {
    dispatch({ type: 'NOTECARD_OPEN', notecardType });
  }, []);

  const handleNotecardClose = useCallback(() => {
    dispatch({ type: 'NOTECARD_CLOSE' });
  }, []);

  // Polaroid handlers
  const handlePolaroidDragEnd = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'POLAROID_DRAG_END', id, x, y });
  }, []);

  const handlePolaroidBringToFront = useCallback((id: string) => {
    dispatch({ type: 'POLAROID_BRING_TO_FRONT', id });
  }, []);

  // TopBar contact handler
  const handleTopBarContactClick = useCallback(() => {
    dispatch({ type: 'PANEL_OPEN', panelType: 'contact' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <TopBar onContactClick={handleTopBarContactClick} />

      {/* DndContext wraps all draggable elements */}
      <DndContext onDragStart={handleTileDragStart} onDragEnd={handleTileDragEnd}>
        <div className="relative">
          {/* Letterboard Hero Section (fills full viewport) */}
          <LetterboardHero
            state={state}
            onFontReady={handleFontReady}
            onBoardMeasured={handleBoardMeasured}
          />

          {/* Left Menu Tiles */}
          <LeftMenuTiles
            tiles={state.tiles}
            onMenuClick={handleMenuClick}
          />

          {/* Right Stage (Hero polaroid or interstitial panel) */}
          {state.boardMetrics && (
            <RightStage
              activePanel={state.panel.activePanel}
              isPanelOpen={state.panel.isPanelOpen}
              heroPolaroids={state.panel.heroPolaroids}
              galleryPolaroids={state.panel.galleryPolaroids}
              onClosePanel={handleClosePanel}
              onPolaroidDragEnd={handlePolaroidDragEnd}
              onPolaroidBringToFront={handlePolaroidBringToFront}
              onRegenerateGalleryPolaroids={handleRegenerateGalleryPolaroids}
              activeNotecard={state.craftPanel.activeNotecard}
              onNotecardOpen={handleNotecardOpen}
              onNotecardClose={handleNotecardClose}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
}

export default App;
