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

function scrollToDiagram1() {
  const el = document.getElementById("irs-diagram-1");
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
        Where did this notice come from?
      </h2>

      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            flexShrink: 0,
            background: "#FFFFFF",
            border: `1.5px solid ${palette.border}`,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 2px 8px -2px rgba(26,29,36,0.1)",
            cursor: "pointer",
          }}
          onClick={scrollToDiagram1}
          title="See the full diagram below"
        >
          <HubThumbnail />
        </div>

        {/* Text + CTA */}
        <div style={{ flex: 1, minWidth: 240, maxWidth: 520 }}>
          <p
            style={{
              fontSize: 14,
              color: "#3F434B",
              lineHeight: 1.7,
              margin: "0 0 10px",
            }}
          >
            Most IRS notices begin when information reported on a tax return
            does not match information received from employers, banks, brokers,
            payment processors, or other third-party reporting entities.
          </p>
          <p
            style={{
              fontSize: 13,
              color: palette.muted,
              lineHeight: 1.6,
              margin: "0 0 20px",
            }}
          >
            The first diagram explains why notices are generated — tracing the
            two streams of information that enter the IRS matching system and
            showing where discrepancies arise.
          </p>

          <button
            onClick={scrollToDiagram1}
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
            See how notices are generated →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mini SVG thumbnail representing Diagram 1 (hub diagram) ─────────────────

function HubThumbnail() {
  const w = 260;
  const h = 160;
  const cx = 130;
  const cy = 80;
  const r = 22;

  // Left nodes (taxpayer info)
  const leftNodes = [
    { y: 30, label: "W-2" },
    { y: 60, label: "1040" },
    { y: 90, label: "Deps." },
    { y: 120, label: "Filings" },
  ];

  // Right nodes (third party)
  const rightNodes = [
    { y: 30, label: "1099-W" },
    { y: 60, label: "1099-K" },
    { y: 90, label: "Bank" },
    { y: 120, label: "Broker" },
  ];

  const nodeW = 44;
  const nodeH = 16;
  const leftX = 8;
  const rightX = w - leftX - nodeW;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {/* Background */}
      <rect width={w} height={h} fill="#FAFAF8" />

      {/* Section labels */}
      <text x={leftX + nodeW / 2} y={16} textAnchor="middle" fontSize={6} fill="#9CA3AF" fontFamily="Inter, sans-serif" fontWeight={600} letterSpacing={0.5}>
        TAX RETURN
      </text>
      <text x={rightX + nodeW / 2} y={16} textAnchor="middle" fontSize={6} fill="#9CA3AF" fontFamily="Inter, sans-serif" fontWeight={600} letterSpacing={0.5}>
        THIRD PARTIES
      </text>

      {/* IRS hub */}
      <circle cx={cx} cy={cy} r={r} fill="#3E5C76" opacity={0.92} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8.5} fill="#FFFFFF" fontFamily="Inter, sans-serif" fontWeight={600}>
        IRS
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fontSize={5} fill="rgba(255,255,255,0.65)" fontFamily="Inter, sans-serif">
        matching
      </text>

      {/* Lines: left → hub */}
      {leftNodes.map((n) => (
        <line
          key={n.y}
          x1={leftX + nodeW}
          y1={n.y + nodeH / 2}
          x2={cx - r}
          y2={cy}
          stroke="#3E5C76"
          strokeWidth={0.8}
          strokeOpacity={0.28}
        />
      ))}

      {/* Lines: right → hub */}
      {rightNodes.map((n) => (
        <line
          key={n.y}
          x1={rightX}
          y1={n.y + nodeH / 2}
          x2={cx + r}
          y2={cy}
          stroke="#3E5C76"
          strokeWidth={0.8}
          strokeOpacity={0.28}
        />
      ))}

      {/* Left nodes */}
      {leftNodes.map((n) => (
        <g key={n.y}>
          <rect x={leftX} y={n.y} width={nodeW} height={nodeH} rx={3} fill="#F0EDE6" stroke="#D8D2C8" strokeWidth={0.8} />
          <text x={leftX + nodeW / 2} y={n.y + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={5.5} fill="#3F434B" fontFamily="Inter, sans-serif">
            {n.label}
          </text>
        </g>
      ))}

      {/* Right nodes */}
      {rightNodes.map((n) => (
        <g key={n.y}>
          <rect x={rightX} y={n.y} width={nodeW} height={nodeH} rx={3} fill="#FFFFFF" stroke="#D8D2C8" strokeWidth={0.8} />
          <text x={rightX + nodeW / 2} y={n.y + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={5.5} fill="#3F434B" fontFamily="Inter, sans-serif">
            {n.label}
          </text>
        </g>
      ))}

      {/* Output arrow */}
      <path d={`M ${cx} ${cy + r} L ${cx} ${h - 6}`} stroke="#B97A57" strokeWidth={1} strokeOpacity={0.6} markerEnd="url(#arrow)" />
      <text x={cx + 5} y={h - 10} fontSize={5.5} fill="#B97A57" opacity={0.8} fontFamily="Inter, sans-serif">
        notice
      </text>

      <defs>
        <marker id="arrow" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#B97A57" opacity={0.6} />
        </marker>
      </defs>
    </svg>
  );
}
