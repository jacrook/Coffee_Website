import { useEffect, useState } from 'react';
import favicon from '/favicon-96x96.png';
import tinaMobile from '/tina_mobile.png';

export function MobileInterstitial() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{
        backgroundColor: '#00ffff',
        flexDirection: isLandscape ? 'row' : 'column',
      }}
    >
      {/* Favicon section - always 1/3 */}
      <div
        className="flex items-center justify-center"
        style={{ flex: 1, minWidth: 0, minHeight: 0 }}
      >
        <img
          src={favicon}
          alt="Site icon"
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Text section - always 1/3 */}
      <div
        className="flex items-center justify-center p-4"
        style={{ flex: 1, minWidth: 0, minHeight: 0 }}
      >
        <p className="text-black text-2xl font-bold text-center">
          Load in Desktop Mode
        </p>
      </div>

      {/* Tina image section - always 1/3 */}
      <div
        className="relative"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <img
          src={tinaMobile}
          alt="Tina the dog"
          className="absolute max-w-[100%] max-h-[100%] object-contain"
          style={{
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    </div>
  );
}
