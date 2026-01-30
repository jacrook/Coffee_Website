import { useState, useEffect } from 'react';

export function useFontReady(fontName: string): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkFontReady() {
      try {
        // Format font name: wrap in quotes if it contains spaces
        const formattedFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;

        // Try to load the font specifically
        await document.fonts.load(`16px ${formattedFontName}`);

        // Then wait for all fonts to be ready
        await document.fonts.ready;

        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.warn(`Font loading failed for ${fontName}:`, error);
        // Set ready anyway to prevent blocking
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    checkFontReady();

    return () => {
      mounted = false;
    };
  }, [fontName]);

  return isReady;
}
