import { useState, useEffect, RefObject } from 'react';
import type { BoardMetrics } from '../types';
import { SVG_VIEWBOX_HEIGHT, ROW_HEIGHT, GROOVE_SNAP_Y } from '../components/letterboard/BoardBackground';

// Simple debounce function
function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

function measureBoard(element: Element | HTMLElement): BoardMetrics {
  const rect = element.getBoundingClientRect();

  // CRITICAL: Use board-relative scale factor, NOT window-relative
  const scaleFactor = rect.height / SVG_VIEWBOX_HEIGHT;

  return {
    width: rect.width,
    height: rect.height,
    rowHeightPx: ROW_HEIGHT * scaleFactor,
    grooveOffsetPx: GROOVE_SNAP_Y * scaleFactor,
    scaleFactor,
  };
}

export function useBoardMetrics(containerRef: RefObject<HTMLElement | null>): BoardMetrics | null {
  const [metrics, setMetrics] = useState<BoardMetrics | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Initial measurement
    const initialMetrics = measureBoard(element);
    setMetrics(initialMetrics);

    // Debounced resize handler
    const handleResize = debounce(() => {
      if (containerRef.current) {
        setMetrics(measureBoard(containerRef.current));
      }
    }, 250);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  return metrics;
}
