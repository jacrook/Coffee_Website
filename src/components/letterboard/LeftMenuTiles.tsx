import type { Tile, PanelType } from '../../types';
import { isMenuItem } from '../../utils/menuLayout';

interface LeftMenuTilesProps {
  tiles: Tile[];
  onMenuClick?: (panelType: PanelType) => void;
}

export function LeftMenuTiles({
  tiles,
  onMenuClick,
}: LeftMenuTilesProps) {
  // Filter for menu tiles only
  const menuTiles = tiles.filter((tile) => isMenuItem(tile.char));

  return (
    <div
      className="left-menu-tiles"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '20%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through to tiles
        zIndex: 5,
      }}
    >
      {menuTiles.map((tile) => (
        <MenuTile
          key={tile.id}
          tile={tile}
          onClick={() => {
            // Extract panel type from the full heading text
            const panelType = tile.char.toLowerCase() as PanelType;
            if (onMenuClick && ['journey', 'craft', 'gallery', 'contact'].includes(panelType)) {
              onMenuClick(panelType);
            }
          }}
        />
      ))}
    </div>
  );
}

interface MenuTileProps {
  tile: Tile;
  onClick?: () => void;
}

function MenuTile({ tile, onClick }: MenuTileProps) {
  return (
    <div
      className="menu-tile cursor-pointer hover:brightness-110"
      onClick={onClick}
      style={{
        fontFamily: '"LetterboardWhite Pixillo", sans-serif',
        color: 'white',
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${tile.width}px`,
        height: `${tile.fontSizePx * 1.2}px`,
        fontSize: `${tile.fontSizePx}px`,
        lineHeight: `${tile.fontSizePx * 1.2}px`,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        // Transform-based positioning
        transform: `translate3d(${tile.x}px, ${tile.y}px, 0)`,
        // Embossed text effect
        textShadow: `
          1px 1px 0 rgba(255, 255, 255, 0.1),
          -1px -1px 0 rgba(0, 0, 0, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.5)
        `,
        pointerEvents: 'auto', // Enable pointer events on tiles
        userSelect: 'none',
        transition: 'filter 0.2s ease',
      } as React.CSSProperties}
    >
      {tile.char}
    </div>
  );
}
