

# TRD — Home Page Runtime (Initial Load + Interstitial Panels)

## 1) Scope

### 1.1 Goal

Implement the Home page experience:

* **Initial load state** (top bar + draggable tile title + draggable tile menu + hero polaroid)
* **Left menu click → interstitial panel** that animates **up and from the right** to fill the **right 80% area**
* Interstitial content types:

  * “Butcher paper” panel (Journey / Craft / Contact)
  * “Polaroid gallery” panel (Gallery)

### 1.2 Non-goals

* Deep routing (multi-page). This is a one-page app with panel state.
* Persistence of polaroid positions across sessions (optional later).
* Full editor for headings (copy can be hardcoded initially).

---

## 2) Tech Stack (unchanged)

* Vite + React + TypeScript
* Tailwind
* @dnd-kit/core
* State: React + reducers
* Tile headings: absolute positioned tiles with `translate3d`
* Fonts:

  * Tiles: LetterboardWhite Pixillo.otf (OTF)
  * Body: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;`

---

## 3) Page Layout (High-level)

### 3.1 Regions

**A) Top Navbar (done)**

* Fixed height, small text line across top.
* No tile behavior here.

**B) Main “Board” Area**
Board background spans the full visible page area.

Within the board:

* **Title row(s)** (H1 tiles)
* **Left Menu column** (~20% width)
* **Right Content column** (~80% width)

### 3.2 Responsive rule (minimum)

* Desktop/tablet: left menu stays visible; right content is 80% panel.
* Mobile: optional for v1, but recommended behavior:

  * stack layout (menu above content) OR collapse menu to button.

---

## 4) Initial Load State (Default)

### 4.1 Required elements

1. **Top navbar** (already implemented)
2. **H1 Title: “James Crook”**

   * Rendered as draggable letter tiles (Letterboard font).
   * Positioned as an H1 per heading sizing system (row-based placement).
3. **Left Menu** (20% width)

   * Menu items rendered as **tile headings** (Letterboard font), draggable letters.
   * Items:

     * Journey
     * Craft
     * Gallery
     * Contact
4. **Right Side (80% width): Hero content**

   * Displays **one polaroid** (draggable).

### 4.2 Left Menu behavior (initial state)

* All menu items are visible.
* One item may be “active” state visually (optional). Default: none active until click.

### 4.3 Hero Polaroid behavior

* Appears on load with a slight tilt and pinned style (visual-only).
* Draggable within the right content area bounds.
* No groove snapping required (freeform drag).

---

## 5) Left Menu (Tile-based Navigation)

### 5.1 Rendering

* Left menu is a dedicated container occupying ~20% width.
* Each menu item is its own **TileHeading** group (letters are individual tiles).

### 5.2 Click vs drag interaction

Because menu items are draggable tiles *and* clickable:

* Use dnd-kit activation constraint to prevent “click becomes drag”:

  * Example: require small movement threshold (e.g., 6–10px) before drag begins.
* A click/tap on the menu heading triggers panel open.

### 5.3 Positioning of Menu Headings

Menu headings are tile groups positioned on distinct board rows.

* Requirement: items are vertically stacked and aligned left within the menu column.
* Implementation detail:

  * Use a **Menu Row System** separate from H1–H4 hero headings.
  * Example:

    * Start row: 5
    * Row step: 2
    * Journey row = 5, Craft = 7, Gallery = 9, Contact = 11
* Letters snap to groove lines in the same way as other tiles.

---

## 6) Interstitial Panel System (Right 80% Column)

### 6.1 Open/Close Rules

* Clicking a menu item opens an interstitial panel in the right column.
* Panel fills the **right 80%** region.
* Left menu remains visible.
* Panel includes a close (“X”) button at top-right.
* Close returns to default Hero state.

### 6.2 Motion Spec (required)

Panel animation on open:

* Enters from **right** while moving **up** (diagonal).
* Recommended implementation (CSS or animation library):

  * initial: `opacity: 0`, `transform: translate3d(+48px, +32px, 0)`
  * enter: `opacity: 1`, `transform: translate3d(0, 0, 0)`
  * duration: 350–500ms
  * easing: `cubic-bezier(0.22, 1, 0.36, 1)` (snappy ease-out)

Panel animation on close:

* Reverse of open (optional) OR fade out quickly (200–300ms).

### 6.3 Layering

* Panel is above hero content when open.
* Hero content can either:

  * unmount when panel opens, or
  * remain mounted but visually obscured (simpler to unmount).

---

## 7) Interstitial Types & Content

### 7.1 Journey Interstitial (Butcher Paper)

* Background: **butcher paper SVG**
* Close button: top-right
* Title: **“My Journey”** centered near top (normal text, not tiles)
* Body copy: dummy paragraph text (body serif font)

### 7.2 Craft Interstitial (Butcher Paper)

* Background: butcher paper SVG
* Close button top-right
* Title: **“My Craft”** (centered)
* Body: dummy text

### 7.3 Contact Interstitial (Butcher Paper)

* Background: butcher paper SVG
* Close button top-right
* Title: **“Contact”** (centered)
* Body: dummy text

### 7.4 Gallery Interstitial (Polaroid Grid / Scatter)

* Background: **no butcher paper** (board remains visible behind or a plain transparent layer).
* Content: a collection of polaroids (same style as hero).
* Polaroids are draggable (freeform).
* Initial layout:

  * Polaroids appear in “random” positions **within the right 80% panel bounds**
  * Must **not overlap** on initial load
  * Mild random rotations allowed (visual-only)

---

## 8) Drag Behavior (Tiles + Polaroids)

### 8.1 Tile drag (Headings + Menu)

* Dragging a tile uses transform-based movement: `translate3d`
* On drag end:

  * Snap Y to nearest groove line (board snap rules)
  * Clamp to bounds (tile must stay on board)
* Manual override:

  * If a tile has been dragged, set `manuallyMoved = true`
  * On resize/reflow, preserve manually moved tiles.

### 8.2 Polaroid drag (Hero + Gallery)

* Freeform drag (no groove snapping)
* Clamp within the right panel bounds.
* Optional: bring-to-front on drag start (z-index increase).

---

## 9) Gallery Non-overlap Placement Algorithm

### 9.1 Requirements

* On Gallery panel open, generate positions for N polaroids (e.g., 6–12).
* Place them in random-looking locations **without overlap**.
* All polaroids must be fully within the right content bounds.

### 9.2 Recommended algorithm (deterministic + safe)

* Define each polaroid’s bounding box size (w/h).
* Generate candidate positions using seeded pseudo-random:

  * seed = `panelOpenTimestamp` or `gallerySessionId`
* Use rejection sampling:

  * For each polaroid, attempt up to K placements (e.g., 200)
  * Accept a position if it does not intersect any existing polaroid rect (with a padding margin)
  * If K attempts fail, fall back to a simple grid slot placement (guaranteed success)

This ensures “random but never overlapping.”

---

## 10) State & Reducer Model (Home Page)

### 10.1 Home UI State

* `activePanel: 'hero' | 'journey' | 'craft' | 'gallery' | 'contact'`
* `menuHeadings: Heading[]` (Journey/Craft/Gallery/Contact)
* `heroPolaroid: PolaroidModel`
* `galleryPolaroids: PolaroidModel[]` (generated on open)
* `tiles: TileModel[]` (includes H1 tiles + menu tiles + any other tile headings)
* `fontReady: boolean`
* `boardMetrics: BoardMetrics | null` (measured via ResizeObserver)

### 10.2 Actions

* `PANEL_OPEN(panelType)`
* `PANEL_CLOSE()`
* `GALLERY_GENERATE_POLAROIDS(seed)`
* `TILE_DRAG_END(tileId, x, y)` → snap + commit + manuallyMoved true
* `POLAROID_DRAG_END(id, x, y)` → clamp + commit
* `BOARD_MEASURED(metrics)` → may trigger reflow
* `FONT_READY()` → triggers initial layout

---

## 11) Component Breakdown

### 11.1 Core

* `<HomePage />`

  * `<TopBar />` (done)
  * `<Board />` (background + overlay layers)

    * `<TitleTiles />` (H1 tiles)
    * `<LeftMenuTiles />` (tile headings)
    * `<RightStage />`

      * `<HeroPolaroid />` (default)
      * `<InterstitialPanel />` (conditionally rendered)

        * `<ButcherPaperPanel />` (Journey/Craft/Contact)
        * `<GalleryPanel />` (polaroids)

### 11.2 Utilities

* `useFontReady('LetterboardWhite')`
* `useBoardMetrics()` via ResizeObserver
* `layoutTilesForHeading(...)`
* `snapToGroove(...)`
* `generateNonOverlappingPolaroids(...)`

---

## 12) Acceptance Criteria

### Initial load

* Top navbar visible.
* “James Crook” renders as tiles; tiles are draggable; spacing is unified.
* Left menu shows Journey/Craft/Gallery/Contact as tile headings; click opens panel; tiles remain draggable.
* Hero polaroid loads and is draggable within right area.

### Panel behavior

* Clicking a menu item opens the panel with diagonal slide (from right + up).
* Panel fills right 80% and does not cover the left menu.
* Close button returns to hero state.

### Journey/Craft/Contact panels

* Butcher paper background appears.
* Title centered top + dummy body text.

### Gallery panel

* No butcher paper background.
* Multiple polaroids appear in random positions **without overlapping**.
* Polaroids are draggable and constrained to the right area.

