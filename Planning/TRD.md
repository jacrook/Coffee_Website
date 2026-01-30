Below is a **Technical Requirements Document (TRD)** for your one-page “Letterboard Portfolio” site based on your current prototype HTML approach (SVG slat background + absolutely positioned draggable letters + snap-to-grooves). 

---

# TRD — Letterboard Portfolio (One Page)

## 1) Overview

### 1.1 Goal

Build a single-page website whose “headline typography” is represented as **movable letter tiles** on a **felt/letterboard background**. Tiles snap to horizontal grooves and load as cohesive words with unified spacing.

### 1.2 Non-Goals

* Rich CMS / multi-page routing (this is one page)
* Full WYSIWYG editor (v1 can be “predefined headings” only)
* Server-side persistence for tile placements (optional later)

---

## 2) Tech Stack

### 2.1 Framework & Tooling

* **Vite + React + TypeScript**
* ESLint + Prettier (standard TS + React setup)

### 2.2 Styling

* **Tailwind CSS**

  * Use Tailwind for overall layout, spacing, responsiveness, and theme tokens.
  * Avoid Tailwind for per-tile placement (tiles are positioned via computed x/y).

### 2.3 Interaction

* **@dnd-kit/core** for drag

  * Pointer + touch support
  * Good control for snapping logic and constraints

### 2.4 State Management

* React state + **reducers**

  * Headings array, tiles array, drag state, “manually moved” flags
  * Reducer actions: INIT_LAYOUT, DRAG_START, DRAG_MOVE, DRAG_END, RESIZE_REFLOW, SET_HEADING_TEXT

---

## 3) Typography

### 3.1 Letterboard Tile Font (Headings)

* **LetterboardWhite Pixillo.otf**
* Loaded via `@font-face` (local asset)
* Must wait for font readiness before measurement and initial layout:

  * `document.fonts.ready` (FontFaceSet)

### 3.2 Body Font Recommendations (Companion Stack)

You want something that:

* reads cleanly on textured backgrounds,
* contrasts the decorative headline tiles,
* feels “editorial / crafted”.

Recommended stack:

* `font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;`

In Tailwind terms:

* Headings tiles: custom font family `font-letterboard`
* Body: `font-sans` (Option B) or `font-serif` (Option A)

---

## 4) Layout Requirements (One Page)

### 4.1 Page Regions (from rough mock)

* **Top thin bar** (small text: “Let’s grab a coffee - Oak Park - Forest Park”)
* **Main letterboard hero** with H1 tile heading
* **Left rail / nav** with Section links (H2 tiles or normal text; v1 can be normal text for speed)
* **Main content area** on right (paper/card texture sections)

### 4.2 Layout Approach

* Use **flexbox/grid** for macro layout:

  * header bar
  * left nav + right content
* Do **NOT** use flex/grid for tile placement:

  * tiles are absolutely positioned

---

## 5) Feltboard Rendering

### 5.1 Background

* Use **SVG feltboard background** (or CSS background image)
* Grooves (slats) exist visually and define snap grid.

### 5.2 Coordinate System

* Board container: `position: relative`
* Tiles: `position: absolute` with `transform: translate3d(x,y,0)`

  * Avoid `left/top` updates for drag movement (use transform for smoother perf).
  * Keep `left/top` optional only for initial placement if you want, but prefer transform universally.

### 5.3 Groove Snap Rules

* Snap tile’s **top edge** to nearest groove line.
* Groove height derived from SVG slat pattern:

  * Row height
  * Groove offset within row

---

## 6) Tile System

### 6.1 Headings Covered

Movable letters apply ONLY to:

* **H1, H2, H3, H4**

Body copy remains standard HTML text.

### 6.2 Tile Layout / “Kerning”

To guarantee the unified spacing you asked for:

**Measurement:**

* Use Canvas `measureText` after `document.fonts.ready`.
* But layout is **tile-based**, not proportional kerning.

**Tile sizing:**

* Compute **tileWidth** as: the **max glyph width** within the heading string at the current font size.
* Every tile gets `width = tileWidth` and `text-align: center`.

**Spacing constants:**

* `LETTER_GAP` between letters within a word
* `WORD_GAP` between words
* Both scale with computed font size (em-based constants)

This produces consistent “letterboard” spacing regardless of glyph shape.

### 6.3 Initial Load Behavior

* On page load: tiles should appear already aligned as complete phrases (no “stretch then settle”).
* Must block layout until font is ready, then compute tile widths, then render.

### 6.4 Resize Behavior

* If user has manually moved a tile, do not reflow that tile on resize.
* For non-moved tiles:

  * recompute positions and re-center phrase

---

## 7) Drag & Snap (dnd-kit)

### 7.1 Drag Requirements

* Drag individual tiles with mouse/touch.
* During drag:

  * tile elevates with shadow
  * cursor changes to grabbing
* On drop:

  * tile snaps to nearest groove
  * tile constrained inside board bounds

### 7.2 dnd-kit Implementation Notes

* Use `DndContext` + `useDraggable`
* Maintain active drag id in reducer
* On drag move:

  * update tile transform
* On drag end:

  * compute snap position
  * commit snapped position to state
  * set `manuallyMoved = true`

---

## 8) Component Architecture (React)

### 8.1 Proposed Component Tree

* `<App />`

  * `<TopBar />` (normal text)
  * `<MainLayout />` (flex/grid)

    * `<LeftNav />` (links)
    * `<ContentPanel />` (paper texture sections)
    * `<LetterboardHero />` (board + tiles overlay)

### 8.2 Letterboard Components

* `<LetterboardHero>`

  * `<BoardBackground />` (SVG or CSS)
  * `<TilesLayer />` (absolute overlay, pointer enabled)

    * `<Tile />` (draggable)

### 8.3 Hooks / Utilities

* `useFontReady(fontName)`
* `useBoardMetrics()` (row height, groove offset, scaling)
* `layoutHeadingTiles(text, level, metrics)` (returns tile list)
* `snapToGroove(x,y, metrics)` (returns snapped coordinates)

---

## 9) Data Model

### 9.1 Types (TS)

* `HeadingLevel = 'H1' | 'H2' | 'H3' | 'H4'`
* `Heading { id, level, text, rowIndex, align: 'center' | 'left' }`
* `Tile { id, headingId, index, char, x, y, width, fontSize, manuallyMoved }`
* `BoardMetrics { rowHeightPx, grooveOffsetPx, bounds }`

---

## 10) Styling Guidelines (Tailwind)

### 10.1 Global

* Use Tailwind for layout, spacing, and responsive behavior.
* Keep board/tile visuals mostly in CSS modules or a dedicated `letterboard.css` if needed (clean separation).

### 10.2 Tile Styles

* White letters with shadow/emboss effect
* Dragging state: scale up slightly + heavier shadow
* Use `will-change: transform` for smoothness

---

## 11) Acceptance Criteria

### 11.1 Core

* H1 renders as letter tiles and loads centered with unified spacing (no blown-out word gaps).
* Tiles snap to grooves on drop.
* Tiles remain draggable on desktop and mobile.
* Resizing preserves manually moved tiles; non-moved tiles re-center.

### 11.2 Quality

* No layout shift after font loads (font-ready measurement gating).
* Drag feels smooth (transform-based movement).
* Maintains 60fps for typical headings (< 50 tiles).

---

## 12) Milestones

### M1 — Scaffold

* Vite + React + TS + Tailwind installed
* Static layout matches rough mock proportions

### M2 — Board + Tiles

* SVG background rendering
* H1 tile heading layout + font-ready gating

### M3 — Drag + Snap

* dnd-kit drag works
* snap-to-groove + bounds

### M4 — Heading Support

* Add H2/H3/H4 tile headings (where needed)
* Basic nav and content sections

### M5 — Polish

* animation on load (optional)
* accessibility passes
* responsive tuning

---

If you want, I can also generate:

* a **project folder structure** (Vite + Tailwind + assets/fonts),
* a **TS type file** (`types.ts`) + a `layout.ts` module,
* and a **starter `LetterboardHero.tsx`** implementing the measurement + tile layout + dnd-kit skeleton.

# TRD Addendum — JS Parity + React Implementation Details

## 13) JS Parity Requirements (Current HTML → React/TS Mapping)

### 13.1 Source of Truth

The current prototype logic in `fullpage.html` defines:

* Heading sizing system (H1–H4 clamp + vw)
* Heading row positioning system (H1 row 2 → H4 row 11)
* Tile-based “unified kerning” (fixed tile width + letter/word gaps)
* Groove snapping (row height + groove offset with scale factor)
* “Manual override” behavior for dragged tiles

React implementation MUST preserve these behaviors.

---

## 14) Heading Size System (H1–H4)

### 14.1 Requirements

Headings are rendered as **movable tile letters** ONLY for:

* H1, H2, H3, H4

Each heading level has a responsive sizing rule:

* **H1:** clamp(4rem, 12vw, 10rem) — positioned at **row 2**
* **H2:** clamp(3rem, 10vw, 8rem) — positioned at **row 5**
* **H3:** clamp(2.5rem, 8vw, 6rem) — positioned at **row 8**
* **H4:** clamp(2rem, 6vw, 5rem) — positioned at **row 11**

### 14.2 Implementation Rules (React)

* Provide an API equivalent to:
  `createHeading(text, level)`
  In React, this is a **state action** that appends a heading definition (no DOM mutation).
* Automatic row positioning derives from heading level:

  * `H1→2, H2→5, H3→8, H4→11`
* Each tile MUST carry heading level metadata:

  * `tile.headingLevel` in state (and optionally `data-heading-level` in DOM for debugging)

---

## 15) Font System + Measurement Pipeline (No Layout Shift)

### 15.1 Fonts

* Tile font (Headings H1–H4): **LetterboardWhite Pixillo.otf**
* Body text font stack (global default):
  `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;`

### 15.2 Font Readiness Requirement

Tile layout computations MUST NOT run until the tile font is ready.

* Required gate:

  * `await document.fonts.load('16px LetterboardWhite')`
  * then `await document.fonts.ready`

### 15.3 Measurement Method

* Use Canvas measurement:

  * `CanvasRenderingContext2D.measureText()`
* But keep the letterboard look tile-based (not true typographic kerning):

  * **Fixed tile width** = max glyph width in the heading string at the chosen font size
  * **Uniform letter spacing** via `LETTER_GAP`
  * **Uniform word spacing** via `WORD_GAP`

### 15.4 Spacing Constants

Define spacing in em-relative terms (scales with font size):

* `LETTER_SPACING_EM` (intra-word)
* `WORD_SPACING_EM` (inter-word)

These constants MUST be the only place spacing is tuned. Layout must honor them consistently.

---

## 16) Board Coordinate System + Snap Grid

### 16.1 Board Positioning

* Board container: `position: relative`
* Tile positioning: `position: absolute` with `transform: translate3d(x, y, 0)`
  (required for smoother dragging and fewer layout invalidations)

### 16.2 Groove Snap Model

* The board has repeating horizontal rows (slats).
* Each row has a snap groove offset within it.
* Snap logic:

  * compute nearest row for the tile y-position
  * snap y to: `rowIndex * rowHeightPx + grooveOffsetPx`

### 16.3 Scale Factor: MUST be Board-relative

Prototype uses `window.innerHeight / svgViewboxHeight`.
React MUST use board element measurements:

* `scaleFactor = boardRect.height / SVG_VIEWBOX_HEIGHT`

This prevents snap drift when board is not full-viewport (e.g., in real layout with nav + content).

### 16.4 Bounds

Tile movement must be clamped to board bounds:

* x ∈ [0, boardWidth - tileWidth]
* y ∈ [0, boardHeight - tileHeight]
  No magic constants.

---

## 17) Multi-Heading Support (Fix Prototype Limitation)

### 17.1 Requirement

The system MUST support multiple headings simultaneously:

* `createHeading('James Crook', 'H1')`
* `createHeading('Section Title', 'H2')`
* etc.

### 17.2 Prohibition

Do NOT clear the entire tile layer when creating a new heading.
In React this means:

* No “replace all tiles” behavior for simple additions.
* State updates should append/merge tile sets.

### 17.3 Derived Layout vs Manual Overrides

On layout or resize, tiles are computed from headings.
However:

* Tiles marked `manuallyMoved: true` MUST keep their position and not be overwritten by reflow.

---

## 18) Drag & Snap Implementation (@dnd-kit/core)

### 18.1 Library

Use `@dnd-kit/core`.

### 18.2 Drag Behavior

* Drag tiles with pointer + touch.
* During drag, tile uses transform updates (dnd-kit style transform).
* On drop:

  1. clamp to bounds
  2. snap to nearest groove line
  3. commit to state
  4. set `manuallyMoved: true`

### 18.3 Events to Support

* `onDragStart` → set `activeTileId`
* `onDragMove` → optional live preview; avoid heavy recalcs
* `onDragEnd` → snap + commit

---

## 19) State Model (React + Reducers)

### 19.1 Types (TypeScript)

* `HeadingLevel = 'H1' | 'H2' | 'H3' | 'H4'`

**Heading**

* `id: string`
* `level: HeadingLevel`
* `text: string`

**Tile**

* `id: string`
* `headingId: string`
* `headingLevel: HeadingLevel`
* `index: number` (character index within heading)
* `char: string`
* `x: number`
* `y: number`
* `width: number` (tileWidth)
* `fontSizePx: number`
* `manuallyMoved: boolean`

**BoardMetrics**

* `width: number`
* `height: number`
* `rowHeightPx: number`
* `grooveOffsetPx: number`
* `scaleFactor: number`

### 19.2 Reducer Actions

Required actions:

* `FONT_READY`
* `BOARD_MEASURED(metrics)`
* `ADD_HEADING({text, level})` *(the React equivalent of createHeading)*
* `UPDATE_HEADING_TEXT({headingId, text})`
* `INIT_OR_REFLOW_LAYOUT` *(recompute tiles for non-manual)*
* `DRAG_START({tileId})`
* `DRAG_MOVE({tileId, x, y})` *(optional live commit; can be ephemeral)*
* `DRAG_END({tileId, x, y})` *(snap + persist + set manuallyMoved)*

### 19.3 Layout Recompute Rules

When headings, board metrics, or font readiness changes:

* recompute “derived” tiles for each heading
* merge into state preserving:

  * any tiles where `manuallyMoved === true`

---

## 20) Pure Utility Functions (Must Exist as Testable Units)

Implement these as pure TS modules (no DOM mutation), and unit-test them:

1. `getFontSizeForHeading(level, viewportWidthPx) => number`
2. `getRowIndexForHeading(level) => number` (2/5/8/11 mapping)
3. `computeTileWidth(text, fontSizePx, fontFamily) => number`
   (max glyph width via canvas measureText)
4. `layoutHeadingTiles(heading, boardMetrics, spacing) => Tile[]`
   (centers phrase, sets x/y per tile)
5. `snapToGroove(x, y, tile, boardMetrics) => {x, y}`
6. `clampToBounds(x, y, tile, boardMetrics) => {x, y}`

---

## 21) Rendering Rules (DOM/CSS)

### 21.1 Tile Layer

* One tile layer above the board background:

  * `pointer-events: auto` for tiles
  * background can be SVG or CSS (no interaction required)

### 21.2 Transform-based Positioning

Tile style must be derived from state:

* `style={{ transform: \`translate3d(${x}px, ${y}px, 0)` }}`

Avoid `left/top` updates in drag loops.

