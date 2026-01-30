/**
 * Panel animation constants and utilities
 * Diagonal slide-in animation from right+up
 */

export const PANEL_ANIMATION_DURATION = 350;

export const PANEL_ANIMATION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Initial transform state for panel (diagonal offset)
 */
export function getPanelInitialTransform(): string {
  return 'translate3d(48px, -32px, 0)';
}

/**
 * Final transform state for panel (no offset)
 */
export function getPanelFinalTransform(): string {
  return 'translate3d(0, 0, 0)';
}

/**
 * CSS transition string for panel animation
 */
export function getPanelTransition(): string {
  return `transform ${PANEL_ANIMATION_DURATION}ms ${PANEL_ANIMATION_EASING}, opacity ${PANEL_ANIMATION_DURATION}ms ${PANEL_ANIMATION_EASING}`;
}

/**
 * Get the inline styles for panel animation
 * @param isMounted - Whether the panel is mounted (triggers animation)
 */
export function getPanelAnimationStyles(isMounted: boolean): React.CSSProperties {
  return {
    transform: isMounted ? getPanelFinalTransform() : getPanelInitialTransform(),
    opacity: isMounted ? 1 : 0,
    transition: getPanelTransition(),
    willChange: 'transform, opacity',
  };
}
