# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a **pre-development prototype project** for a "Letterboard Portfolio" website. The project consists of:
- HTML/CSS/JavaScript prototypes in `test/` directory
- Comprehensive technical requirements in `Planning/TRD.md`
- MCP server for AI-assisted debugging in `mcp-senior-dev/`

The React implementation has not been started yet. See TRD.md for complete implementation specifications.

## Tech Stack (Planned)

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS (for layout), custom CSS for letterboard tiles
- **Drag & Drop**: @dnd-kit/core
- **Font**: LetterboardWhite Pixillo.otf (custom letterboard font)
- **State**: React reducers for headings, tiles, drag state

## MCP Server (Development Tool)

The `mcp-senior-dev/` directory contains a Model Context Protocol server that provides AI-assisted debugging. To start it:

```bash
cd mcp-senior-dev
npm install
node server.mjs
```

Requires OpenAI API key in `.env` file.

## Prototype Files (Reference Implementation)

The `test/` directory contains working HTML prototypes that define the canonical behavior:

- `fullpage.html` - Complete letterboard with draggable tiles, snap-to-groove logic, and unified tile spacing
- `index.html` - Side-by-side CSS vs SVG approach comparison
- `letterboard.css` - Letterboard styling patterns

**These prototypes are the source of truth for interaction behavior.** Any React implementation must preserve this behavior.

## Core Architecture Concepts

### Letterboard Tile System

Headings (H1-H4) are rendered as **individual movable letter tiles** on a felt/letterboard background, not as continuous text.

**Key behaviors:**
- Tiles snap to horizontal grooves on drag release
- Each tile has unified width (max glyph width in heading) for consistent spacing
- Tiles use `transform: translate3d(x,y,0)` for performant dragging
- Font loading gates initial layout to prevent layout shift
- Manually moved tiles preserve position on resize; others reflow

### Heading Level System

Each heading level maps to a specific row on the board and has responsive sizing:

- **H1**: clamp(4rem, 12vw, 10rem) → row 2
- **H2**: clamp(3rem, 10vw, 8rem) → row 5
- **H3**: clamp(2.5rem, 8vw, 6rem) → row 8
- **H4**: clamp(2rem, 6vw, 5rem) → row 11

### Board Coordinate System

- Board container: `position: relative`
- Tiles: `position: absolute` with transform-based positioning
- Groove snap: `rowIndex * rowHeightPx + grooveOffsetPx`
- Scale factor: `boardRect.height / SVG_VIEWBOX_HEIGHT` (board-relative, not window-relative)

### Pure Utility Functions (Must Be Testable)

When implementing the React version, these should be pure functions:

1. `getFontSizeForHeading(level, viewportWidthPx) => number`
2. `getRowIndexForHeading(level) => number` (2/5/8/11 mapping)
3. `computeTileWidth(text, fontSizePx, fontFamily) => number` (Canvas measureText)
4. `layoutHeadingTiles(heading, boardMetrics, spacing) => Tile[]`
5. `snapToGroove(x, y, tile, boardMetrics) => {x, y}`
6. `clampToBounds(x, y, tile, boardMetrics) => {x, y}`

## State Model (TypeScript Types)

```typescript
type HeadingLevel = 'H1' | 'H2' | 'H3' | 'H4';

interface Heading {
  id: string;
  level: HeadingLevel;
  text: string;
}

interface Tile {
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

interface BoardMetrics {
  width: number;
  height: number;
  rowHeightPx: number;
  grooveOffsetPx: number;
  scaleFactor: number;
}
```

## Reducer Actions

Required state management actions:
- `FONT_READY` - Font has loaded, layout can proceed
- `BOARD_MEASURED(metrics)` - Board dimensions computed
- `ADD_HEADING({text, level})` - Add new heading (preserve existing tiles)
- `INIT_OR_REFLOW_LAYOUT` - Recompute tiles for non-manual tiles
- `DRAG_START({tileId})` - Begin drag operation
- `DRAG_END({tileId, x, y})` - Snap, persist, set manuallyMoved=true

## Important Constraints

- **DO NOT** clear all tiles when adding a heading (multi-heading support required)
- **DO NOT** use flex/grid for tile placement (tiles are absolutely positioned)
- **DO NOT** reflow tiles marked `manuallyMoved: true` on resize
- **MUST** wait for `document.fonts.ready` before measuring and laying out tiles
- **MUST** use board-relative scale factor, not window-relative
- **MUST** preserve prototype's snap-to-groove physics and unified spacing

## Planned Project Structure (Not Yet Created)

```
/src
  /components
    LetterboardHero.tsx
    BoardBackground.tsx
    TilesLayer.tsx
    Tile.tsx
  /hooks
    useFontReady.ts
    useBoardMetrics.ts
  /utils
    layout.ts      # Pure tile layout functions
    metrics.ts     # Font sizing, row mapping
    snap.ts        # Groove snapping logic
  /types
    index.ts       # TypeScript interfaces
  App.tsx
```

## Development Commands (Once Vite is Set Up)

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## References

- `Planning/TRD.md` - Complete technical requirements (read this first)
- `test/fullpage.html` - Working prototype with all interaction logic
