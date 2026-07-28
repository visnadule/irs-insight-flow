import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

// Colours are darkened vs. the node palette so labels and strokes
// remain legible at small sizes on the parchment background (#F7F5F0).
const palette = {
  escalation: "#3E5C76", // slate-navy — same as nodes, good contrast already
  resolution: "#4E7A55", // darkened sage-green (was #7D9A82, too light)
  neutral:    "#6A7A8A", // darkened slate-grey (was #9FA8B3, too light)
};

// Neutral condition-label colour (independent of stroke colour)
const NEUTRAL_LABEL = "#404A56";

export interface NoticeEdgeData {
  condition: string;
  edgeStyle: "escalation" | "resolution" | "neutral";
  dimmed?: boolean;
  highlighted?: boolean;
  [key: string]: unknown;
}

export function NoticeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const edgeData = data as NoticeEdgeData | undefined;
  const edgeStyle   = edgeData?.edgeStyle ?? "neutral";
  const condition   = edgeData?.condition ?? "";
  const dimmed      = edgeData?.dimmed    ?? false;
  const highlighted = edgeData?.highlighted ?? false;

  const strokeColor = palette[edgeStyle];
  // Slightly heavier strokes than before for better legibility at small zoom levels.
  const strokeWidth = highlighted
    ? 2.8
    : edgeStyle === "escalation"
      ? 2.0
      : edgeStyle === "resolution"
        ? 1.6
        : 1.7;
  const strokeDash = edgeStyle === "resolution" ? "5 4" : undefined;
  const opacity    = dimmed
    ? 0.12
    : highlighted
      ? 1
      : edgeStyle === "resolution"
        ? 0.75
        : 0.9;

  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);
  const isHorizontal = dy < dx * 0.4;

  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (isHorizontal && edgeStyle === "escalation") {
    [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.3,
    });
  }

  const labelColor =
    edgeStyle === "escalation"
      ? palette.escalation
      : edgeStyle === "resolution"
        ? palette.resolution
        : NEUTRAL_LABEL;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: strokeDash,
          opacity,
          transition: "opacity 200ms ease, stroke-width 150ms ease",
        }}
      />
      {condition && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
              fontFamily: SANS,
              fontSize: 10,       // was 9 — bumped for legibility
              fontWeight: 500,
              color: labelColor,
              background: "rgba(247,245,240,0.93)",
              borderRadius: 4,
              padding: "2px 5px",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              opacity,
              transition: "opacity 200ms ease",
            }}
            className="nodrag nopan"
          >
            {condition}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const edgeTypes = {
  noticeEdge: NoticeEdge,
};
