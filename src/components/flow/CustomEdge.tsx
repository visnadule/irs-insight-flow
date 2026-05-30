import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

const palette = {
  escalation: "#3E5C76",
  resolution: "#9BB3A2",
  neutral: "#9FA8B3",
};

export interface NoticeEdgeData {
  condition: string;
  timing?: string;
  edgeStyle: "escalation" | "resolution" | "neutral";
  showTiming: boolean;
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
  const timing = edgeData?.timing ?? "";
  const showTiming = edgeData?.showTiming ?? true;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = palette[edgeStyle];
  const strokeWidth =
    edgeStyle === "escalation" ? 1.5 : edgeStyle === "resolution" ? 1 : 1.2;
  const strokeDash =
    edgeStyle === "resolution" ? "4 3" : undefined;

  const label =
    showTiming && timing ? `${condition} · ${timing}` : condition;
  const showLabel = label.length > 0;

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
          opacity: edgeStyle === "resolution" ? 0.65 : 0.85,
        }}
      />
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
              fontFamily: SANS,
              fontSize: 10,
              color:
                edgeStyle === "escalation"
                  ? "#3E5C76"
                  : edgeStyle === "resolution"
                  ? "#7D9A82"
                  : "#6B7280",
              background: "rgba(247,245,240,0.88)",
              borderRadius: 4,
              padding: "1px 5px",
              whiteSpace: "nowrap",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
              backdropFilter: "blur(2px)",
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const edgeTypes = {
  noticeEdge: NoticeEdge,
};
