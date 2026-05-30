import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  noticeNodes,
  noticeEdges,
  timingAnnotations,
  type NoticeNodeData,
} from "../../data/notices";
import { nodeTypes } from "./CustomNodes";
import { edgeTypes } from "./CustomEdge";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { Legend } from "./Legend";

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
const palette = {
  slateBlue: "#3E5C76",
  sage: "#7D9A82",
  terracotta: "#B97A57",
  paper: "#F7F5F0",
  border: "#D8D2C8",
  muted: "#6B7280",
  ink: "#1A1D24",
};

// ─── Connected elements helper ────────────────────────────────────────────────

function getConnected(nodeId: string) {
  const edgeIds = new Set<string>();
  const nodeIds = new Set<string>();
  noticeEdges.forEach((e) => {
    if (e.source === nodeId || e.target === nodeId) {
      edgeIds.add(e.id);
      nodeIds.add(e.source);
      nodeIds.add(e.target);
    }
  });
  return { edgeIds, nodeIds };
}

// ─── Node / edge builders ─────────────────────────────────────────────────────

function buildNoticeNodes(
  selectedId: string | null,
  connectedNodeIds: Set<string>
): Node[] {
  return noticeNodes.map((n) => {
    const dimmed =
      selectedId !== null && selectedId !== n.id && !connectedNodeIds.has(n.id);
    const highlighted = selectedId !== null && connectedNodeIds.has(n.id);
    return {
      id: n.id,
      type: "noticeNode",
      position: n.position,
      data: { ...n, dimmed, highlighted } as unknown as Record<string, unknown>,
      selectable: true,
      draggable: false,
    };
  });
}

function buildTimingNodes(visible: boolean): Node[] {
  return timingAnnotations.map((t) => ({
    id: t.id,
    type: "timingNode",
    position: t.position,
    data: { text: t.text, visible },
    selectable: false,
    draggable: false,
  }));
}

function buildEdges(
  selectedId: string | null,
  connectedEdgeIds: Set<string>
): Edge[] {
  return noticeEdges.map((e) => {
    const dimmed = selectedId !== null && !connectedEdgeIds.has(e.id);
    const highlighted = selectedId !== null && connectedEdgeIds.has(e.id);
    const isEscalation = e.style === "escalation";
    const isResolution = e.style === "resolution";
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: "noticeEdge",
      data: {
        condition: e.condition,
        edgeStyle: e.style,
        dimmed,
        highlighted,
      } as unknown as Record<string, unknown>,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 9,
        height: 9,
        color: dimmed
          ? "#D0CAC0"
          : highlighted || !selectedId
          ? isEscalation
            ? palette.slateBlue
            : isResolution
            ? palette.sage
            : palette.muted
          : "#D0CAC0",
      },
    };
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IRSNoticeFlow() {
  const [showTiming, setShowTiming] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NoticeNodeData | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...buildNoticeNodes(null, new Set()),
    ...buildTimingNodes(true),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildEdges(null, new Set())
  );

  // Rebuild when selection or timing changes
  useEffect(() => {
    const { edgeIds, nodeIds } = selectedId
      ? getConnected(selectedId)
      : { edgeIds: new Set<string>(), nodeIds: new Set<string>() };

    setNodes([
      ...buildNoticeNodes(selectedId, nodeIds),
      ...buildTimingNodes(showTiming),
    ]);
    setEdges(buildEdges(selectedId, edgeIds));
  }, [selectedId, showTiming, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    // Timing label nodes are not interactive
    if (node.type === "timingNode") return;

    const data = node.data as unknown as NoticeNodeData;
    const next = selectedId === data.id ? null : data.id;
    setSelectedId(next);
    setSelectedNode(next ? data : null);
  }, [selectedId]);

  const onPaneClick = useCallback(() => {
    setSelectedId(null);
    setSelectedNode(null);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        fontFamily: SANS,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ padding: "24px 32px 14px", flexShrink: 0 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: palette.muted,
            margin: "0 0 5px",
          }}
        >
          An educational diagram · ariataxpa.com
        </p>
        <h1
          style={{
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "clamp(20px, 3.2vw, 32px)",
            fontWeight: 400,
            color: palette.ink,
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          How IRS notices escalate over time
        </h1>
        <p
          style={{
            fontSize: 13,
            color: palette.muted,
            margin: 0,
            maxWidth: 540,
            lineHeight: 1.6,
          }}
        >
          The IRS communicates through a defined sequence of notices. Each
          branch represents a decision point — paying, responding, or ignoring
          determines which path follows.
        </p>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <button
            onClick={() => setShowTiming((v) => !v)}
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              color: showTiming ? palette.slateBlue : palette.muted,
              background: showTiming ? "rgba(62,92,118,0.07)" : "transparent",
              border: `1px solid ${showTiming ? "rgba(62,92,118,0.22)" : palette.border}`,
              borderRadius: 20,
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 150ms ease",
              letterSpacing: "0.01em",
            }}
          >
            {showTiming ? "Hide timing" : "Show timing"}
          </button>
          <span style={{ fontSize: 11, color: "#B0A998" }}>
            Click any node to learn more
          </span>
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setSelectedNode(null); }}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: palette.muted,
                background: "transparent",
                border: `1px solid ${palette.border}`,
                borderRadius: 20,
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              Clear selection ×
            </button>
          )}
        </div>
      </header>

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          borderTop: `1px solid ${palette.border}`,
          overflowX: "auto",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, minZoom: 0.3, maxZoom: 1.4 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: false }}
          style={{ background: "transparent" }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          panOnScroll={false}
          preventScrolling={false}
        >
          <Controls showInteractive={false} />
          <Legend />
        </ReactFlow>

        {/* Detail panel — top-right, slides in on selection */}
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => { setSelectedId(null); setSelectedNode(null); }}
        />
      </div>
    </div>
  );
}
