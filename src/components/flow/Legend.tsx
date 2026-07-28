const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
const SERIF = '"Source Serif 4", "Georgia", serif';

const palette = {
  slateBlue:  "#3E5C76",
  sage:       "#4E7A55", // darkened from #7D9A82 to match CustomEdge
  terracotta: "#B97A57",
  ink:        "#1A1D24",
  muted:      "#6B7280",
  border:     "#D8D2C8",
  paper:      "#F7F5F0",
  white:      "#FFFFFF",
};

// Label text uses a darker shade than palette.muted for contrast on parchment.
const LABEL_COLOR = "#404A56";
const TITLE_COLOR = "#7A7470";

export function Legend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        background: "rgba(247,245,240,0.97)",
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: SANS,
        fontSize: 11,
        color: LABEL_COLOR,
        zIndex: 10,
        backdropFilter: "blur(4px)",
        maxWidth: 215,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: TITLE_COLOR,
          marginBottom: 8,
        }}
      >
        Legend
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 9 }}>
        <LegendNode bg="#F0EDE6" border={palette.border}     label="Starting state" />
        <LegendNode bg="#FFFFFF" border={palette.border}     label="IRS notice"           code />
        <LegendNode bg="#EFF4F0" border={palette.sage}       label="Resolved / Refund"    color={palette.sage} />
        <LegendNode bg="#F5EDEA" border={palette.terracotta} label="Final notice / Legal action" color={palette.terracotta} />
      </div>

      <div
        style={{
          borderTop: `1px solid ${palette.border}`,
          paddingTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <LegendEdge color={palette.slateBlue} strokeWidth={2.0} dash={false} label="Escalation path" />
        <LegendEdge color={palette.sage}      strokeWidth={1.6} dash         label="Resolution exit" />
        <LegendEdge color="#6A7A8A"           strokeWidth={1.7} dash={false} label="Neutral / review" />
      </div>
    </div>
  );
}

function LegendNode({
  bg,
  border,
  label,
  code,
  color,
}: {
  bg: string;
  border: string;
  label: string;
  code?: boolean;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div
        style={{
          width: 30,
          height: 15,
          background: bg,
          border: `1.5px solid ${border}`,
          borderRadius: 3,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {code && (
          <div style={{ width: 16, height: 2.5, background: "#3E5C76", borderRadius: 1, opacity: 0.5 }} />
        )}
      </div>
      <span style={{ color: color ?? LABEL_COLOR, lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

function LegendEdge({
  color,
  strokeWidth,
  dash,
  label,
}: {
  color: string;
  strokeWidth: number;
  dash: boolean;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 30, flexShrink: 0, display: "flex", alignItems: "center" }}>
        <svg width="30" height="10" viewBox="0 0 30 10">
          <line
            x1="1" y1="5" x2="26" y2="5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={dash ? "3 2" : undefined}
            opacity={0.9}
          />
          <polygon points="23,2 30,5 23,8" fill={color} opacity={0.9} />
        </svg>
      </div>
      <span style={{ color: LABEL_COLOR, lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}
