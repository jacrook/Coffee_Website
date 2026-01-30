/**
 * Gallery image URLs for preloading
 */
export const GALLERY_IMAGE_URLS = [
  '/Gallery_dark.webp',
  '/Gallery_failfoam.webp',
  '/Gallery_heritage.webp',
  '/Gallery_Ireland.webp',
  '/Gallery_latte.webp',
  '/Gallery_madcap.webp',
  '/Gallery_sparrow.webp',
  '/Gallery_tina.webp',
  '/Gallery_wifefav.webp',
];

/**
 * Hero image URLs for preloading
 */
export const HERO_IMAGE_URLS = [
  '/main_jim.webp',
  '/main_heart.webp',
];

/**
 * Preload an image by creating a new Image object
 * @param url - Image URL to preload
 * @returns Promise that resolves when image is loaded
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Preload multiple images
 * @param urls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.allSettled(
    urls.map(url =>
      preloadImage(url).catch(err => {
        console.warn(err);
      })
    )
  );
}

/**
 * Preload all gallery and hero images
 * Call this when app mounts to start preloading images in background
 */
export async function preloadAllImages(): Promise<void> {
  await preloadImages([...HERO_IMAGE_URLS, ...GALLERY_IMAGE_URLS]);
}
