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
          onClick={scrollToDiagram2}
          title="See the full diagram below"
        >
          <NoticeFlowThumbnail />
        </div>

        {/* Text + CTA */}
        <div style={{ flex: 1, minWidth: 240, maxWidth: 520 }}>
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
    </div>
  );
}

// ── Mini SVG thumbnail previewing the notice escalation chain ─────────────────

function NoticeFlowThumbnail() {
  const w = 260;
  const h = 160;

  const nodes = [
    { label: "CP14", sub: "Balance Due" },
    { label: "CP501", sub: "Reminder" },
    { label: "CP503", sub: "2nd Notice" },
    { label: "CP504", sub: "Intent" },
    { label: "LT11", sub: "Final" },
  ];

  const nodeW = 38;
  const nodeH = 26;
  const gap = 8;
  const totalW = nodes.length * nodeW + (nodes.length - 1) * gap;
  const startX = (w - totalW) / 2;
  const rowY = 52;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <rect width={w} height={h} fill="#FAFAF8" />

      {/* Section label */}
      <text x={w / 2} y={18} textAnchor="middle" fontSize={6} fill="#9CA3AF"
        fontFamily="Inter, sans-serif" fontWeight={600} letterSpacing={0.5}>
        IRS NOTICE ESCALATION SEQUENCE
      </text>

      {/* Start node */}
      <rect x={startX - nodeW - gap} y={rowY} width={nodeW} height={nodeH}
        rx={3} fill="#E5EBF0" stroke="#3E5C76" strokeWidth={0.8} />
      <text x={startX - nodeW / 2 - gap} y={rowY + 9} textAnchor="middle"
        dominantBaseline="middle" fontSize={5} fill="#3E5C76"
        fontFamily="Inter, sans-serif" fontWeight={600}>
        Balance
      </text>
      <text x={startX - nodeW / 2 - gap} y={rowY + 18} textAnchor="middle"
        dominantBaseline="middle" fontSize={4.5} fill="#3E5C76"
        fontFamily="Inter, sans-serif">
        due on return
      </text>

      {/* Arrow from start */}
      <line
        x1={startX - gap} y1={rowY + nodeH / 2}
        x2={startX - 2} y2={rowY + nodeH / 2}
        stroke="#3E5C76" strokeWidth={0.9} strokeOpacity={0.45}
        markerEnd="url(#arr)"
      />

      {/* Notice chain */}
      {nodes.map((n, i) => {
        const x = startX + i * (nodeW + gap);
        const isLast = i === nodes.length - 1;
        return (
          <g key={n.label}>
            <rect x={x} y={rowY} width={nodeW} height={nodeH}
              rx={3} fill="#FFFFFF" stroke="#D8D2C8" strokeWidth={0.8} />
            <text x={x + nodeW / 2} y={rowY + 8} textAnchor="middle"
              dominantBaseline="middle" fontSize={5.5} fill="#3F434B"
              fontFamily="Inter, sans-serif" fontWeight={600}>
              {n.label}
            </text>
            <text x={x + nodeW / 2} y={rowY + 18} textAnchor="middle"
              dominantBaseline="middle" fontSize={4.5} fill="#6B7280"
              fontFamily="Inter, sans-serif">
              {n.sub}
            </text>
            {!isLast && (
              <line
                x1={x + nodeW} y1={rowY + nodeH / 2}
                x2={x + nodeW + gap - 1} y2={rowY + nodeH / 2}
                stroke="#3E5C76" strokeWidth={0.9} strokeOpacity={0.45}
                markerEnd="url(#arr)"
              />
            )}
          </g>
        );
      })}

      {/* End node (Levy) */}
      {(() => {
        const lastX = startX + (nodes.length - 1) * (nodeW + gap);
        const endX = lastX + nodeW + gap;
        const endW = 34;
        return (
          <>
            <line
              x1={lastX + nodeW} y1={rowY + nodeH / 2}
              x2={endX - 1} y2={rowY + nodeH / 2}
              stroke="#B97A57" strokeWidth={0.9} strokeOpacity={0.6}
              markerEnd="url(#arr-red)"
            />
            <rect x={endX} y={rowY} width={endW} height={nodeH}
              rx={3} fill="#FDF0E8" stroke="#B97A57" strokeWidth={0.9} />
            <text x={endX + endW / 2} y={rowY + 9} textAnchor="middle"
              dominantBaseline="middle" fontSize={5} fill="#B97A57"
              fontFamily="Inter, sans-serif" fontWeight={600}>
              Levy /
            </text>
            <text x={endX + endW / 2} y={rowY + 18} textAnchor="middle"
              dominantBaseline="middle" fontSize={4.5} fill="#B97A57"
              fontFamily="Inter, sans-serif">
              Collection
            </text>
          </>
        );
      })()}

      {/* Resolved branch line */}
      {(() => {
        const midX = startX + 2 * (nodeW + gap) + nodeW / 2;
        return (
          <>
            <line x1={midX} y1={rowY + nodeH} x2={midX} y2={h - 22}
              stroke="#7D9A82" strokeWidth={0.8} strokeOpacity={0.55}
              strokeDasharray="2 2" />
            <rect x={midX - 22} y={h - 22} width={44} height={14}
              rx={3} fill="#EAF2EC" stroke="#7D9A82" strokeWidth={0.8} />
            <text x={midX} y={h - 14} textAnchor="middle"
              dominantBaseline="middle" fontSize={5} fill="#7D9A82"
              fontFamily="Inter, sans-serif" fontWeight={500}>
              Resolved
            </text>
          </>
        );
      })()}

      {/* Timing label */}
      <text x={w / 2} y={h - 2} textAnchor="middle" fontSize={5}
        fill="#9CA3AF" fontFamily="Inter, sans-serif" fontStyle="italic">
        each step ≈ 5 weeks if unpaid
      </text>

      <defs>
        <marker id="arr" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="#3E5C76" opacity={0.5} />
        </marker>
        <marker id="arr-red" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="#B97A57" opacity={0.65} />
        </marker>
      </defs>
    </svg>
  );
}
