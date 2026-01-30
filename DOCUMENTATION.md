# Coffee Website - Home Page Documentation

## Overview

The home page features a letterboard hero section with draggable letter tiles and interactive interstitial panels that display content for Journey, Craft, Gallery, and Contact sections.

---

## Main Page Components

### 1. Top Navigation Bar
- **Component**: `TopBar`
- **Location**: Fixed at top of page
- **Height**: 45px
- **Contains**: Navigation links and branding

### 2. Letterboard Hero Section
- **Component**: `LetterboardHero`
- **Location**: Full viewport below navbar
- **Z-Index**: 1-2 (background and tiles)

#### Board Background
- **Component**: `BoardBackground`
- **Description**: Felt/letterboard texture background with horizontal grooves
- **Z-Index**: 1

#### Title Tiles
- **Component**: `TilesLayer` → `Tile`
- **Z-Index**: 15 (above all other elements)
- **Font**: "LetterboardWhite Pixillo"
- **Behavior**: Draggable with snap-to-groove
- **Content**: "James Crook" (H1 level)

**Title Tile Properties**:
- Font size: `clamp(4rem, 12vw, 10rem)`
- Row: 2 (second groove from top)
- Centered horizontally on board
- Individual character tiles
- Embossed text effect
- Drag constraints: Groove snapping + bounds clamping

### 3. Left Menu Navigation
- **Component**: `LeftMenuTiles`
- **Location**: Left 20% of screen
- **Z-Index**: 5
- **Font**: "LetterboardWhite Pixillo"

**Menu Items** (in H2 tiles):
1. **Journey** - Row 5
2. **Craft** - Row 7
3. **Gallery** - Row 9
4. **Contact** - Row 11

**Menu Tile Properties**:
- Font size: `clamp(3rem, 10vw, 8rem)`
- Left-aligned with 16px padding
- Single tile per menu item (full word)
- **Clickable** (opens interstitial panel)
- **NOT draggable**
- Hover effect: Brightness increase

### 4. Right Stage Content Area
- **Component**: `RightStage`
- **Location**: Right 80% of screen
- **Top offset**: 45px (below navbar)
- **Height**: `calc(100% - 45px)`
- **Z-Index**: 3 (below tiles, above background)

#### Default State: Hero Polaroid
- **Component**: `HeroPolaroid`
- **Shown when**: No panel is open
- **Position**: Centered at 50% down the right stage
- **Z-Index**: 10 (relative to RightStage)
- **Behavior**: Draggable (freeform, no groove snap)

**Hero Polaroid Properties**:
- Size: 280px × 340px
- Caption: "James Crook"
- Rotation: Random between -2° to 2°
- White frame with shadow
- Bounds clamped to right stage area

---

## Interstitial Panels

### Panel Activation
- **Trigger**: Click on menu tile (Journey, Craft, Gallery, Contact)
- **Animation**: Diagonal slide-in from right+up
- **Duration**: 350ms
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Initial transform**: `translate3d(48px, -32px, 0)`
- **Final transform**: `translate3d(0, 0, 0)`

### Panel Container
- **Component**: `InterstitialPanel`
- **Location**: Fills entire RightStage area
- **Z-Index**: 20 (above hero polaroid)
- **Features**:
  - Close button (top-right, circular)
  - Conditional content rendering
  - GPU-accelerated animations

### Panel Types

#### 1. Journey Panel
- **Background**: Butcher paper texture (`butcher-paper.png`)
- **Header Font**: "expositionmedium" (sharpie font)
- **Body Font**: "Source Serif 4" (Google Font)
- **Color**: Black (#000000)
- **No text shadows**

**Content**:
```
Title: Journey

My path in software development has been a continuous exploration
of creativity and technology. From writing my first lines of code
to building complex systems, each step has shaped my perspective
on what's possible.

I believe in the power of thoughtful design and elegant solutions.
Every project is an opportunity to learn, grow, and create something
meaningful.
```

#### 2. Craft Panel
- **Background**: Butcher paper texture (same as Journey)
- **Fonts**: Same as Journey (expositionmedium + Source Serif 4)
- **Color**: Black (#000000)

**Content**:
```
Title: Craft

Software craftsmanship is about more than just writing code—it's
about understanding problems deeply and creating solutions that stand
the test of time.

My toolkit includes modern frameworks, tested patterns, and a commitment
to clean, maintainable code. I specialize in React, TypeScript, and
building scalable web applications.
```

#### 3. Contact Panel
- **Background**: Butcher paper texture (same as Journey)
- **Fonts**: Same as Journey (expositionmedium + Source Serif 4)
- **Color**: Black (#000000)

**Content**:
```
Title: Contact

Let's connect and discuss your next project. I'm always interested
in hearing about new opportunities and challenges.

Email: james@example.com
Location: San Francisco, CA
Available for freelance and contract work
```

#### 4. Gallery Panel
- **Background**: None (transparent)
- **Content**: 6-12 randomly positioned polaroids
- **Polaroid behavior**: Individually draggable, bring-to-front on drag
- **Non-overlap algorithm**: Rejection sampling (200 attempts) + grid fallback

**Gallery Polaroid Properties**:
- Sizes: 180×220, 200×240, or 220×260px
- Rotation: Random between -5° to +5°
- Z-Index: Starts at 10, increments for each polaroid
- Captions: "Photo 1", "Photo 2", etc.
- Placeholder images until real URLs added

---

## Z-Index Hierarchy (Layering)

From bottom to top:

| Layer | Z-Index | Description |
|-------|---------|-------------|
| BoardBackground | 1 | Letterboard felt texture |
| RightStage | 3 | Content area container |
| LeftMenuTiles | 5 | Menu navigation tiles |
| HeroPolaroid | 10 | Individual polaroid (when dragging) |
| TilesLayer | 15 | H1 title tiles (always on top) |
| Debug Info | 10 | Development info (dev only) |
| InterstitialPanel | 20 | Open panel (above everything) |

---

## Font Stack

### 1. Letterboard Font
```css
font-family: 'LetterboardWhite Pixillo', sans-serif;
```
- **Used for**: H1 title, H2 menu items
- **File**: `/fonts/LetterboardWhite Pixillo.otf`
- **Style**: Plastic letterboard aesthetic

### 2. Sharpie Font
```css
font-family: 'expositionmedium', cursive;
```
- **Used for**: Interstitial panel headers
- **Files**: `/exposition-4d49-webfont.woff2`, `.woff`
- **Style**: Handwritten marker look

### 3. Body Serif Font
```css
font-family: 'Source Serif 4', ui-serif, Georgia, Cambria,
             "Times New Roman", Times, serif;
```
- **Used for**: Interstitial panel body text
- **Source**: Google Fonts
- **Style**: Elegant serif for readability

---

## Drag & Drop Behavior

### Letter Tiles (Title)
- **Library**: @dnd-kit/core
- **Constraint**: Snap to grooves on Y-axis
- **Bounds**: Clamped to board edges
- **Visual feedback**: Scale up (1.1x), shadow, z-index 100 during drag
- **Persistence**: Manually moved tiles preserve position on resize

### Menu Tiles
- **NOT draggable**
- **Clickable only**
- **Hover**: Brightness increase

### Polaroids (Hero & Gallery)
- **Constraint**: Freeform drag (no snap)
- **Bounds**: Clamped to RightStage area
- **Behavior**:
  - Bring-to-front on drag start (z-index increment)
  - No groove snapping
  - Bounds checking only

---

## Responsive Sizing

### Title (H1)
```css
font-size: clamp(4rem, 12vw, 10rem);
```

### Menu Items (H2)
```css
font-size: clamp(3rem, 10vw, 8rem);
```

### Panel Headers
```css
font-size: clamp(2.5rem, 6vw, 4rem);
```

### Panel Body
```css
font-size: clamp(1rem, 2vw, 1.25rem);
```

---

## File Structure

```
src/
├── components/
│   ├── letterboard/
│   │   ├── BoardBackground.tsx       # SVG felt texture
│   │   ├── LetterboardHero.tsx       # Main container
│   │   ├── LeftMenuTiles.tsx         # Menu navigation
│   │   ├── TilesLayer.tsx            # Draggable title tiles
│   │   └── Tile.tsx                  # Individual tile component
│   ├── ButcherPaperPanel.tsx         # Content panels (Journey/Craft/Contact)
│   ├── GalleryPanel.tsx              # Polaroid grid
│   ├── HeroPolaroid.tsx              # Default state polaroid
│   ├── InterstitialPanel.tsx         # Panel container
│   ├── Polaroid.tsx                  # Reusable polaroid
│   ├── RightStage.tsx                # Content area container
│   └── TopBar.tsx                    # Top navigation
├── utils/
│   ├── letterboardReducer.ts         # State management
│   ├── letterboardLayout.ts          # Tile positioning
│   ├── menuLayout.ts                 # Menu tile positioning
│   ├── panelAnimation.ts             # Slide-in animations
│   ├── polaroidLayout.ts             # Polaroid generation
│   └── snap.ts                       # Groove snapping logic
└── types/
    └── index.ts                      # TypeScript interfaces
```

---

## State Management

### Actions
- `FONT_READY` - Font loaded, can layout tiles
- `BOARD_MEASURED` - Board dimensions computed
- `ADD_HEADING` - Add new heading (multi-heading support)
- `INIT_OR_REFLOW_LAYOUT` - Recompute tile positions
- `DRAG_START` / `DRAG_END` - Tile drag handlers
- `PANEL_OPEN` / `PANEL_CLOSE` - Interstitial state
- `GALLERY_GENERATE_POLAROIDS` - Create gallery layout
- `POLAROID_DRAG_END` - Polaroid position update
- `POLAROID_BRING_TO_FRONT` - Z-index management

---

## Performance Optimizations

1. **GPU Acceleration**: All transforms use `translate3d()` for hardware acceleration
2. **Font Loading**: `font-display: swap` prevents FOIT (Flash of Invisible Text)
3. **Will-change**: Added during drag operations only
4. **Debounced Layout**: Only reflows when metrics actually change
5. **Lazy Panel Generation**: Gallery polaroids generated only when panel opens

---

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features Used**:
  - CSS Grid/Flexbox
  - CSS Custom Properties
  - WebGL (for dnd-kit sensors)
  - WOFF2 font format

---

## Development Notes

- **Debug Info**: Visible in development mode (bottom-right corner)
- **Hot Reload**: Supported by Vite dev server
- **TypeScript**: Full type safety across components
- **Component Isolation**: Each panel is self-contained

---

## Future Enhancements

Potential improvements not yet implemented:

1. Add real images to gallery polaroids
2. Add smooth transitions between panels
3. Implement panel content animations
4. Add mobile touch gesture support
5. Add keyboard navigation
6. Implement deep linking to panels
7. Add loading states for font/image loading
8. Implement analytics tracking
