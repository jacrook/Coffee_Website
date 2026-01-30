import type { Tile } from '../../types';
import { Tile as TileComponent } from './Tile';
import { isMenuItem } from '../../utils/menuLayout';

interface TilesLayerProps {
  tiles: Tile[];
  isPanelOpen?: boolean;
}

export function TilesLayer({ tiles, isPanelOpen = false }: TilesLayerProps) {
  // Filter OUT menu tiles - only render draggable tiles like H1 title
  // Also hide H1 title when panel is open
  const draggableTiles = tiles.filter((tile) => {
    // Exclude menu items
    if (isMenuItem(tile.char)) return false;
    // Hide H1 title when panel is open
    if (isPanelOpen && tile.headingLevel === 'H1') return false;
    return true;
  });

  return (
    <div
      className="absolute inset-0"
      style={{
        zIndex: 15, // Above RightStage (z-3) but below debug (z-10)
        pointerEvents: 'none', // Let clicks pass through to container
      }}
    >
      {draggableTiles.map((tile, index) => (
        <div key={tile.id} style={{ pointerEvents: 'auto' }}>
          <TileComponent tile={tile} index={index} />
        </div>
      ))}
    </div>
  );
}
