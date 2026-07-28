import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NoticeNodeData } from "../../data/notices";

const SERIF = '"Source Serif 4", "Georgia", serif';
const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

const palette = {
  slateBlue: "#3E5C76",
  sage: "#7D9A82",
  terracotta: "#B97A57",
  paper: "#F7F5F0",
  ink: "#1A1D24",
  muted: "#6B7280",
  border: "#D8D2C8",
  white: "#FFFFFF",
};

function categoryStyle(category: NoticeNodeData["category"]) {
  switch (category) {
    case "start":
      return { bg: "#F0EDE6", border: "#C8C2B4", textColor: "#3F434B", codeColor: palette.muted };
    case "notice":
      return { bg: palette.white, border: palette.border, textColor: palette.ink, codeColor: palette.slateBlue };
    case "end-resolved":
      return { bg: "#EFF4F0", border: palette.sage, textColor: palette.sage, codeColor: palette.sage };
    case "end-court":
      return { bg: "#F5EDEA", border: palette.terracotta, textColor: palette.terracotta, codeColor: palette.terracotta };
    case "end-levy":
      return { bg: "#F5EDEA", border: palette.terracotta, textColor: palette.terracotta, codeColor: palette.terracotta };
    case "end-refund":
      return { bg: "#EFF4F0", border: palette.sage, textColor: palette.sage, codeColor: palette.sage };
  }
}

interface ExtendedNodeData extends NoticeNodeData {
  dimmed?: boolean;
  highlighted?: boolean;
  subtitle?: string;
  tooltip?: string;
}

export function NoticeNode({ data, selected }: NodeProps & { data: ExtendedNodeData }) {
  const s = categoryStyle(data.category);
  const isEnd = data.category.startsWith("end-");
  const isStart = data.category === "start";
  const dimmed = data.dimmed ?? false;
  const highlighted = data.highlighted ?? false;

  const borderColor = selected || highlighted ? palette.slateBlue : s.border;
  const shadowStyle =
    selected || highlighted
      ? "0 0 0 2px rgba(62,92,118,0.2), 0 3px 14px -4px rgba(62,92,118,0.28)"
      : "0 1px 3px -1px rgba(26,29,36,0.1)";

  return (
    <div
      title={data.tooltip}
      style={{
        background: s.bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 8,
        boxShadow: shadowStyle,
        minWidth: 155,
        maxWidth: 190,
        padding: isEnd ? "7px 12px" : "9px 12px",
        cursor: "pointer",
        transition: "border-color 150ms ease, box-shadow 150ms ease, opacity 200ms ease",
        fontFamily: SANS,
        opacity: dimmed ? 0.28 : 1,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 6, height: 6 }} />
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0, width: 6, height: 6 }} />

      {data.code && (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 10,
            fontWeight: 700,
            color: s.codeColor,
            letterSpacing: "0.07em",
            marginBottom: 2,
          }}
        >
          {data.code}
        </div>
      )}

      <div
        style={{
          fontFamily: isStart || isEnd ? SERIF : SANS,
          fontSize: isStart ? 12 : isEnd ? 11 : 12,
          fontWeight: 500,
          color: s.textColor,
          lineHeight: 1.3,
        }}
      >
        {data.title}
      </div>

      {data.subtitle && (
        <div
          style={{
            fontFamily: SANS,
            fontSize: 9,
            fontStyle: "italic",
            color: palette.muted,
            marginTop: 3,
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          {data.subtitle}
        </div>
      )}

      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 6, height: 6 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0, width: 6, height: 6 }} />
    </div>
  );
}

// ── Timing label node (non-interactive annotation below each track) ──────────

interface TimingNodeData {
  text: string;
  visible: boolean;
  [key: string]: unknown;
}

export function TimingLabelNode({ data }: NodeProps & { data: TimingNodeData }) {
  return (
    <div
      style={{
        opacity: data.visible ? 1 : 0,
        transition: "opacity 200ms ease",
        pointerEvents: "none",
        fontFamily: SANS,
        fontSize: 10,
        fontStyle: "italic",
        color: "#5E6875", // darkened from #9CA3AF — #9CA3AF fails contrast on parchment
        whiteSpace: "nowrap",
        lineHeight: 1.4,
        userSelect: "none",
        background: "transparent",
        border: "none",
        transform: "translateX(-50%)",
      }}
    >
      {data.text}
    </div>
  );
}

// ── memoised node/edge types (stable references prevent React Flow console warnings)
// Keep these defined once at module level, never inside a component.

export const nodeTypes = {
  noticeNode: NoticeNode,
  timingNode: TimingLabelNode,
};
