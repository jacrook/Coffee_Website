interface BoardBackgroundProps {
  className?: string;
}

// SVG coordinate system constants (must match the prototype)
export const ROW_HEIGHT = 15;
export const GROOVE_SNAP_Y = 13;
export const SVG_VIEWBOX_HEIGHT = 250;
export const SVG_VIEWBOX_WIDTH = 1200;

export function BoardBackground({ className = '' }: BoardBackgroundProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 1 }}
      aria-label="Letterboard background with horizontal grooves"
    >
      <defs>
        {/* Pattern for repeating slats */}
        <pattern id="slat" x="0" y="0" width={SVG_VIEWBOX_WIDTH} height={ROW_HEIGHT} patternUnits="userSpaceOnUse">
          {/* Wood/felt slat */}
          <rect x="0" y="0" width={SVG_VIEWBOX_WIDTH} height={ROW_HEIGHT} fill="#2a2520" />
          {/* Highlight at groove */}
          <rect x="0" y="0" width={SVG_VIEWBOX_WIDTH} height="1" fill="#3d3630" />
          {/* Shadow at top of slat */}
          <rect x="0" y={ROW_HEIGHT - 2} width={SVG_VIEWBOX_WIDTH} height="2" fill="#1a1612" opacity="0.5" />
        </pattern>

        {/* Vignette effect */}
        <radialGradient id="vignette">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Background with repeating slat pattern */}
      <rect x="0" y="0" width={SVG_VIEWBOX_WIDTH} height={SVG_VIEWBOX_HEIGHT} fill="url(#slat)" />

      {/* Vignette overlay */}
      <rect x="0" y="0" width={SVG_VIEWBOX_WIDTH} height={SVG_VIEWBOX_HEIGHT} fill="url(#vignette)" />
    </svg>
  );
}
