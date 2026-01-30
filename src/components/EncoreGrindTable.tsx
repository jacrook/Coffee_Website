import { ENCORE_GRIND_SETTINGS, BREW_METHOD_ICONS } from '../data/notecardContent';

export function EncoreGrindTable() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        fontFamily: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
      }}
    >
      <table
        className="grind-table"
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                borderBottom: '2px solid rgba(0, 0, 0, 0.15)',
                fontWeight: 600,
                color: '#000',
                fontSize: '1.1em',
                width: '80px',
              }}
            >
              Grind
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                borderBottom: '2px solid rgba(0, 0, 0, 0.15)',
                fontWeight: 600,
                color: '#000',
                fontSize: '1.1em',
              }}
            >
              Brew
            </th>
          </tr>
        </thead>
        <tbody>
          {ENCORE_GRIND_SETTINGS.map((setting, index) => (
            <tr key={index}>
              <td
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  fontWeight: 600,
                  fontSize: '1.2em',
                  color: '#1a3a3a',
                  verticalAlign: 'top',
                }}
              >
                {setting.grindSize}
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  verticalAlign: 'middle',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <img
                    src={BREW_METHOD_ICONS[setting.iconName]}
                    alt={setting.brewMethod}
                    style={{
                      width: '28px',
                      height: '28px',
                      objectFit: 'contain',
                    }}
                  />
                  <span style={{ color: '#000' }}>{setting.brewMethod}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
