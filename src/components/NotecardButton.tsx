interface NotecardButtonProps {
  title: string;
  subtitle?: string;
  onClick: () => void;
  ariaLabel?: string;
}

export function NotecardButton({ title, subtitle, onClick, ariaLabel }: NotecardButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || title}
      className="notecard-button"
      style={{
        width: 'clamp(140px, 20vw, 200px)',
        height: 'clamp(90px, 12vw, 120px)',
        backgroundImage: 'url(/notecard.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'expositionmedium', cursive",
        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
        color: '#1a3a3a',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      <div
        style={{
          textAlign: 'center',
          lineHeight: '1.2',
          fontWeight: 'normal',
        }}
      >
        <div>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: '0.7em',
              marginTop: '2px',
              fontFamily: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}
