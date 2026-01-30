import { useRef, useEffect } from 'react';
import { BoardBackground } from './BoardBackground';
import { TilesLayer } from './TilesLayer';
import { useFontReady } from '../../hooks/useFontReady';
import { useBoardMetrics } from '../../hooks/useBoardMetrics';
import type { LetterboardState, BoardMetrics } from '../../types';

interface LetterboardHeroProps {
  state: LetterboardState;
  onFontReady?: () => void;
  onBoardMeasured?: (metrics: BoardMetrics) => void;
}

export function LetterboardHero({
  state,
  onFontReady,
  onBoardMeasured,
}: LetterboardHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Wait for font to load before rendering tiles
  const fontReady = useFontReady('LetterboardWhite Pixillo');

  // Measure board dimensions
  const boardMetrics = useBoardMetrics(containerRef);

  // Notify parent when font is ready
  useEffect(() => {
    if (fontReady && onFontReady) {
      onFontReady();
    }
  }, [fontReady, onFontReady]);

  // Notify parent when board is measured
  useEffect(() => {
    if (boardMetrics && onBoardMeasured) {
      onBoardMeasured(boardMetrics);
    }
  }, [boardMetrics, onBoardMeasured]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ minHeight: '600px' }}
    >
      {/* SVG Background (z-index 1) */}
      <BoardBackground />

      {/* Tiles Layer - DndContext is now at App level */}
      {fontReady && state.tiles.length > 0 && (
        <TilesLayer tiles={state.tiles} isPanelOpen={state.panel.isPanelOpen} />
      )}

      {/* Debug info (development only) */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-black/50 p-2 rounded z-10">
          <div>Font: {fontReady ? '✓ Ready' : 'Loading...'}</div>
          {boardMetrics && (
            <>
              <div>Board: {Math.round(boardMetrics.width)}x{Math.round(boardMetrics.height)}</div>
              <div>Scale: {boardMetrics.scaleFactor.toFixed(3)}</div>
              <div>Tiles: {state.tiles.length}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
