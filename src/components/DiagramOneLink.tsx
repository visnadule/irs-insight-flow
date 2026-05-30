const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
const SERIF = '"Source Serif 4", "Georgia", serif';

const palette = {
  slateBlue: "#3E5C76",
  sage: "#7D9A82",
  ink: "#1A1D24",
  muted: "#6B7280",
  border: "#D8D2C8",
  paper: "#F7F5F0",
  light: "#F0EDE6",
};

function scrollToDiagram2() {
  const el = document.getElementById("irs-diagram-2");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DiagramOneLink() {
  return (
    <div
      style={{
        fontFamily: SANS,
        padding: "48px 32px 40px",
        borderTop: `1px solid ${palette.border}`,
        background: palette.light,
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: palette.muted,
          margin: "0 0 6px",
        }}
      >
        Connected diagram
      </p>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(18px, 2.5vw, 26px)",
          fontWeight: 400,
          color: palette.ink,
          margin: "0 0 28px",
          lineHeight: 1.25,
        }}
      >
        What happens after a mismatch is detected?
      </h2>

      <div style={{ maxWidth: 600 }}>
          <p
            style={{
              fontSize: 14,
              color: "#3F434B",
              lineHeight: 1.7,
              margin: "0 0 20px",
            }}
          >
            When information reported on a tax return does not match information
            received from employers, banks, brokers, payment processors, or
            other reporting entities, the IRS may generate a notice.
          </p>

          <button
            onClick={scrollToDiagram2}
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 500,
              color: "#FFFFFF",
              background: palette.slateBlue,
              border: "none",
              borderRadius: 6,
              padding: "9px 18px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "background 150ms ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#334e63")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.background = palette.slateBlue)
            }
          >
            Explore the IRS notice timeline →
          </button>
      </div>
    </div>
  );
}
