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
  bgHover: "#EAE6DE",
};

function categoryStyle(category: NoticeNodeData["category"]) {
  switch (category) {
    case "start":
      return {
        bg: "#F0EDE6",
        border: palette.border,
        textColor: palette.ink,
        codeColor: palette.muted,
        pill: false,
      };
    case "notice":
      return {
        bg: palette.white,
        border: palette.border,
        textColor: palette.ink,
        codeColor: palette.slateBlue,
        pill: false,
      };
    case "end-resolved":
      return {
        bg: "#EFF4F0",
        border: palette.sage,
        textColor: palette.sage,
        codeColor: palette.sage,
        pill: true,
      };
    case "end-court":
      return {
        bg: "#F5EDEA",
        border: palette.terracotta,
        textColor: palette.terracotta,
        codeColor: palette.terracotta,
        pill: true,
      };
    case "end-levy":
      return {
        bg: "#F5EDEA",
        border: palette.terracotta,
        textColor: palette.terracotta,
        codeColor: palette.terracotta,
        pill: true,
      };
    case "end-refund":
      return {
        bg: "#EFF4F0",
        border: palette.sage,
        textColor: palette.sage,
        codeColor: palette.sage,
        pill: true,
      };
  }
}

export function NoticeNode({
  data,
  selected,
}: NodeProps & { data: NoticeNodeData }) {
  const s = categoryStyle(data.category);
  const isEnd =
    data.category === "end-resolved" ||
    data.category === "end-court" ||
    data.category === "end-levy" ||
    data.category === "end-refund";
  const isStart = data.category === "start";

  const borderColor = selected ? palette.slateBlue : s.border;
  const shadowStyle = selected
    ? "0 0 0 2px rgba(62,92,118,0.18), 0 2px 12px -4px rgba(62,92,118,0.22)"
    : "0 1px 4px -2px rgba(26,29,36,0.12)";

  return (
    <div
      style={{
        background: s.bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 8,
        boxShadow: shadowStyle,
        minWidth: 162,
        maxWidth: 200,
        padding: isEnd ? "8px 14px" : "10px 14px",
        cursor: "pointer",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        fontFamily: SANS,
      }}
    >
      {/* Source handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, width: 8, height: 8 }}
      />

      {/* Code badge */}
      {data.code && (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 11,
            fontWeight: 600,
            color: s.codeColor,
            letterSpacing: "0.06em",
            marginBottom: 3,
          }}
        >
          {data.code}
        </div>
      )}

      {/* Title */}
      <div
        style={{
          fontFamily: isStart || isEnd ? SERIF : SANS,
          fontSize: isStart ? 13 : isEnd ? 12 : 13,
          fontWeight: isStart ? 500 : isEnd ? 500 : 500,
          color: s.textColor,
          lineHeight: 1.35,
          fontStyle: isStart ? "normal" : "normal",
        }}
      >
        {data.title}
      </div>

      {/* Target handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, width: 8, height: 8 }}
      />
      {/* Also allow bottom connections for review track */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0, width: 8, height: 8 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ opacity: 0, width: 8, height: 8 }}
      />
    </div>
  );
}

export const nodeTypes = {
  noticeNode: NoticeNode,
};
