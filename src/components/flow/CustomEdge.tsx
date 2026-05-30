import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

const palette = {
  escalation: "#3E5C76",
  resolution: "#7D9A82",
  neutral: "#9FA8B3",
};

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
  const edgeStyle = edgeData?.edgeStyle ?? "neutral";
  const condition = edgeData?.condition ?? "";
  const dimmed = edgeData?.dimmed ?? false;
  const highlighted = edgeData?.highlighted ?? false;

  const strokeColor = palette[edgeStyle];
  const strokeWidth = highlighted ? 2.5 : edgeStyle === "escalation" ? 1.8 : edgeStyle === "resolution" ? 1.3 : 1.5;
  const strokeDash = edgeStyle === "resolution" ? "5 4" : undefined;
  const opacity = dimmed ? 0.12 : highlighted ? 1 : edgeStyle === "resolution" ? 0.7 : 0.85;

  // Use bezier for diagonal/resolution paths, straight for horizontal escalation
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
      : "#6B7280";

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
              fontSize: 9,
              fontWeight: 500,
              color: labelColor,
              background: "rgba(247,245,240,0.9)",
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
