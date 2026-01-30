import { useLayoutEffect, useRef, useState } from 'react';

interface SharpieDrawSVGProps {
  SVGComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  isAnimating: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function SharpieDrawSVG({ SVGComponent, isAnimating, className, style }: SharpieDrawSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathsMeasured, setPathsMeasured] = useState(false);

  // Measure path lengths on mount
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || pathsMeasured) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const paths = svg.querySelectorAll('path');
      const baseDelay = 200; // Start after panel begins sliding
      const staggerRange = 800; // Random delay 0-800ms

      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength();

        // Set CSS custom properties
        path.style.setProperty('--path-length', `${length}px`);
        path.style.setProperty(
          '--stagger-delay',
          `${baseDelay + Math.random() * staggerRange}ms`
        );
      });

      setPathsMeasured(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathsMeasured]);

  // Trigger animation after measurement
  useLayoutEffect(() => {
    if (!isAnimating || !pathsMeasured) return;

    const container = containerRef.current;
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Small delay to ensure CSS custom properties are applied
    const timer = setTimeout(() => {
      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        // Remove class first to reset animation state
        path.classList.remove('animating');
        // Force reflow to enable animation restart
        void (path as SVGPathElement).getTotalLength();
        // Re-add class to trigger animation
        requestAnimationFrame(() => {
          path.classList.add('animating');
        });
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [isAnimating, pathsMeasured]);

  // Reset animation when panel closes
  useLayoutEffect(() => {
    if (!isAnimating) {
      const container = containerRef.current;
      if (!container) return;

      const svg = container.querySelector('svg');
      if (!svg) return;

      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        path.classList.remove('animating');
        // Force reflow to enable animation restart
        void (path as SVGPathElement).getTotalLength();
      });
    }
  }, [isAnimating]);

  return (
    <div ref={containerRef} className={className} style={style}>
      <SVGComponent style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}
