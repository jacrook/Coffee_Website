import { getPanelAnimationStyles } from '../utils/panelAnimation';
import type { PanelType, NotecardType } from '../types';
import butcherPaperImage from '/butcher-paper.png';
import { ContactForm } from './ContactForm';
import { SharpieDrawSVG } from './SharpieDrawSVG';
import { NotecardButton } from './NotecardButton';
import { NotecardOverlay } from './NotecardOverlay';
import CoffeeJourneySharpieSVG from '../assets/coffee_journey_sharpie_2_cropped_solid_black.svg?react';

interface ButcherPaperPanelProps {
  panelType: PanelType;
  isMounted: boolean;
  activeNotecard?: NotecardType;
  onNotecardOpen?: (notecardType: 'encore' | 'v60') => void;
  onNotecardClose?: () => void;
}

const PANEL_CONTENT: Record<
  Exclude<PanelType, 'hero' | 'gallery' | 'contact'>,
  { title: string; body: string; hasImage?: boolean; imageSrc?: string }
> = {
  journey: {
    title: 'Journey',
    body: `I started making coffee at home with a basic drip machine and some curiosity. A work trip to Germany shifted my perspective; espresso there wasn't just about caffeine, it was something people took time with. When I got back, I got into Aeropress, Chemex, and eventually settled on the V60. I spent a lot of time tweaking grind size, water temperature, and timing until the cup came out right.

That same attention to detail carried over when I started working at Zemi. I learned how to keep quality up while moving fast by staying organized, calm, and actually welcoming, one drink at a time.`,
    hasImage: true,
    imageSrc: '/coffee_journey_sharpie_2_cropped_solid_black.svg',
  },
  craft: {
    title: 'Craft',
    body: `Making coffee you can trust starts well before the first sip. It's in the small, repeatable choices that add up to a consistently good cup. At home, I dial things in by taste, tweaking grind size, pour speed, and water temp to suit each coffee. My setup's simple but precise. The Baratza Encore does a solid job for the price. Being able to fine-tune the grind helps everything after that fall into place, whether I'm aiming for clarity with a V60 or going for something richer.

Same approach with espresso. For me, consistency matters more than chasing the perfect shot. I keep my setup clean, my workflow calm, and stick to a routine. I focus on puck prep, distribution, and timing so the shots aren't just decent, they're predictable. Good espresso isn't a fluke. It's repeatable.

Milk's still a work in progress. I'm building up my latte art, but I care more about the foundation: getting that smooth, glossy microfoam that feels like wet paint. The goal isn't just a nice pattern. It's the right texture, the right balance, and a drink that feels good to drink.`,
  },
};

export function ButcherPaperPanel({
  panelType,
  isMounted,
  activeNotecard,
  onNotecardOpen,
  onNotecardClose,
}: ButcherPaperPanelProps) {
  // Contact panel renders the form, not static content
  if (panelType === 'contact') {
    return (
      <div
        className="butcher-paper-panel"
        style={{
          ...getPanelAnimationStyles(isMounted),
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Butcher paper background - using PNG image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${butcherPaperImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            opacity: 0.9,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: "'expositionmedium', cursive",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 'normal',
              color: '#000000',
              marginBottom: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            Contact
          </h1>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    );
  }

  const content = PANEL_CONTENT[panelType as keyof typeof PANEL_CONTENT];

  if (!content) {
    return null;
  }

  // Check if this panel has an image (Journey)
  if (content.hasImage) {
    return (
      <div
        className="butcher-paper-panel"
        style={{
          ...getPanelAnimationStyles(isMounted),
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Butcher paper background - using PNG image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${butcherPaperImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            opacity: 0.9,
          }}
        />

        {/* Content Container - Two Column Layout */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Title - Centered */}
          <h1
            style={{
              fontFamily: "'expositionmedium', cursive",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 'normal',
              color: '#000000',
              marginTop: '1.5rem',
              marginBottom: '2rem',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}
          >
            {content.title}
          </h1>

          {/* Two Columns */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              gap: '40px',
              alignItems: 'stretch',
            }}
          >
            {/* Left Column - Text (50%) - Vertically Middle */}
            <div
              style={{
                flex: '0 0 50%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Body text */}
              <p
                style={{
                  fontFamily: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  lineHeight: '1.8',
                  color: '#000000',
                  whiteSpace: 'pre-line',
                }}
              >
                {content.body}
              </p>
            </div>

            {/* Right Column - Image (50%) - Vertically Top */}
            <div
              className="sharpie-svg-container"
              style={{
                flex: '0 0 50%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              {panelType === 'journey' ? (
                <SharpieDrawSVG
                  SVGComponent={CoffeeJourneySharpieSVG}
                  isAnimating={isMounted}
                  className="sharpie-draw-container"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                  }}
                />
              ) : content.imageSrc ? (
                <img
                  src={content.imageSrc}
                  alt={`${content.title} illustration`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout - centered text (Craft)
  // Split body into paragraphs for notecard insertion
  const craftParagraphs = panelType === 'craft' ? content.body.split('\n\n') : [content.body];
  const isCraftPanel = panelType === 'craft';

  return (
    <div
      className="butcher-paper-panel"
      style={{
        ...getPanelAnimationStyles(isMounted),
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 4vw, 40px)',
      }}
    >
      {/* Butcher paper background - using PNG image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${butcherPaperImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          opacity: 0.9,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'clamp(600px, 70vw, 900px)',
          textAlign: 'center',
          filter: activeNotecard ? 'blur(4px)' : 'none',
          transition: 'filter 300ms ease',
          pointerEvents: activeNotecard ? 'none' : 'auto',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'expositionmedium', cursive",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'normal',
            color: '#000000',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
          }}
        >
          {content.title}
        </h1>

        {/* Body text - split into paragraphs with notecard buttons */}
        <div
          style={{
            fontFamily: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
            lineHeight: '1.6',
            color: '#000000',
            textAlign: 'left',
          }}
        >
          {craftParagraphs.map((paragraph, index) => (
            <div key={index}>
              <p
                style={{
                  marginBottom: index < craftParagraphs.length - 1 ? '1rem' : '0',
                }}
              >
                {paragraph}
              </p>

              {/* Insert notecard buttons after first paragraph (index 1) */}
              {isCraftPanel && index === 1 && onNotecardOpen && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 'clamp(12px, 2vw, 24px)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                    zIndex: 2,
                  }}
                >
                  <NotecardButton
                    title="Encore Grind"
                    subtitle="Settings"
                    onClick={() => onNotecardOpen('encore')}
                    ariaLabel="View Encore grind settings"
                  />
                  <NotecardButton
                    title="V60 Recipe"
                    subtitle="Details"
                    onClick={() => onNotecardOpen('v60')}
                    ariaLabel="View V60 recipe details"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notecard Overlay */}
      {isCraftPanel && onNotecardClose && (
        <NotecardOverlay
          isOpen={activeNotecard !== null && activeNotecard !== undefined}
          notecardType={activeNotecard || null}
          onClose={onNotecardClose}
        />
      )}
    </div>
  );
}
