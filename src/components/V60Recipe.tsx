import { V60_RECIPE } from '../data/notecardContent';

export function V60Recipe() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        fontFamily: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
        lineHeight: '1.6',
      }}
    >
      {V60_RECIPE.map((field, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '12px',
            marginBottom: index < V60_RECIPE.length - 1 ? '16px' : '0',
            borderBottom: index < V60_RECIPE.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            paddingBottom: index < V60_RECIPE.length - 1 ? '12px' : '0',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: '#1a3a3a',
              textAlign: 'right',
            }}
          >
            {field.label}:
          </div>
          <div
            style={{
              color: '#000',
            }}
          >
            {field.isLink ? (
              <a
                href={field.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#1a3a3a',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(26, 58, 58, 0.4)',
                  transition: 'textDecorationColor 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecorationColor = '#1a3a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecorationColor = 'rgba(26, 58, 58, 0.4)';
                }}
              >
                {field.value}
              </a>
            ) : (
              field.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
