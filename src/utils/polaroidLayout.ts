import type { Polaroid } from '../types';
import { getRotatedBounds } from './polaroidUtils';

/**
 * Hero polaroid image options
 */
const HERO_IMAGES = [
  { src: '/main_jim.webp', caption: 'Jim' },
  { src: '/main_heart.webp', caption: 'Coffee + Community' },
];

/**
 * Gallery polaroid images with captions
 */
const GALLERY_IMAGES = [
  { src: '/Gallery_dark.webp', caption: 'Dark Matter: Daily Driver' },
  { src: '/Gallery_failfoam.webp', caption: 'Foam Fail - Over steamed' },
  { src: '/Gallery_heritage.webp', caption: 'Heritage Bikes & Coffee' },
  { src: '/Gallery_Ireland.webp', caption: 'Hunting Coffee Fav part of travel (Ireland)' },
  { src: '/Gallery_latte.webp', caption: 'A decent latte attempt' },
  { src: '/Gallery_madcap.webp', caption: 'Fav MI Coffee' },
  { src: '/Gallery_sparrow.webp', caption: 'Solid Coffee - Sparrow' },
  { src: '/Gallery_tina.webp', caption: 'Tina <3 Pup Cups' },
  { src: '/Gallery_wifefav.webp', caption: "Wife's fav: Cinnamon Foam Latte" },
];

/**
 * Polaroid size presets (width, height in px)
 */
const POLAROID_SIZES = [
  { width: 180, height: 220 },
  { width: 200, height: 240 },
  { width: 220, height: 260 },
];

/**
 * Generate a random rotation between min and max degrees
 */
function randomRotation(min: number = -5, max: number = 5): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a unique ID for a polaroid
 */
function generateId(): string {
  return `polaroid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate gallery polaroids with random positions
 * Photos can touch and overlap, but stay within viewport bounds
 *
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @param count - Number of polaroids to generate (default: 9 for all gallery images)
 * @returns Array of randomly positioned polaroids
 */
export function generateGalleryPolaroids(
  containerWidth: number,
  containerHeight: number,
  count: number = 9
): Polaroid[] {
  const polaroids: Polaroid[] = [];

  // Use conservative padding to ensure polaroids stay well inside
  const padding = 30;

  for (let i = 0; i < count; i++) {
    // Get the image data for this index (cycle through if count > available images)
    const imageData = GALLERY_IMAGES[i % GALLERY_IMAGES.length];

    // Randomly select a size
    const size = POLAROID_SIZES[Math.floor(Math.random() * POLAROID_SIZES.length)];
    const rotation = randomRotation(-5, 5);

    // Get rotated bounds for this polaroid
    const rotatedBounds = getRotatedBounds(size.width, size.height, rotation);

    // Calculate safe bounds with extra padding
    const maxX = Math.max(padding, containerWidth - rotatedBounds.width - padding);
    const maxY = Math.max(padding, containerHeight - rotatedBounds.height - padding);

    // Generate random position within safe bounds
    const pos = {
      x: padding + Math.random() * (maxX - padding),
      y: padding + Math.random() * (maxY - padding),
    };

    polaroids.push({
      id: generateId(),
      x: pos.x,
      y: pos.y,
      rotation,
      width: size.width,
      height: size.height,
      zIndex: 10 + i,
      caption: imageData.caption,
      imageUrl: imageData.src,
    });
  }

  return polaroids;
}

/**
 * Create hero polaroids (centered with slight rotation)
 * Positioned in lower portion to avoid overlapping title (row 2)
 * Title tiles are at z-15, so polaroids (z-10) appear below them
 * Returns both hero images positioned side by side
 */
export function createHeroPolaroids(
  containerWidth: number,
  containerHeight: number
): Polaroid[] {
  const width = 280;
  const height = 340;
  const gap = 40; // Gap between the two polaroids

  const polaroids: Polaroid[] = [];

  // Position both hero images side by side
  for (let i = 0; i < HERO_IMAGES.length; i++) {
    const rotation = randomRotation(-2, 2);
    const heroImage = HERO_IMAGES[i];

    // Get rotated bounds for proper centering
    const rotatedBounds = getRotatedBounds(width, height, rotation);

    // Position in lower center - title is at top (rows 1-3)
    // Start y position at 50% down to avoid title area
    const y = containerHeight * 0.5;

    // Calculate x position to center both polaroids
    // Use rotated bounds for proper centering
    const totalWidth = rotatedBounds.width * 2 + gap;
    const startX = (containerWidth - totalWidth) / 2;
    const x = startX + i * (rotatedBounds.width + gap);

    polaroids.push({
      id: generateId(),
      x,
      y,
      rotation,
      width,
      height,
      zIndex: 10 + i, // Below title tiles (z-15) but above background
      caption: heroImage.caption,
      imageUrl: heroImage.src,
    });
  }

  return polaroids;
}
