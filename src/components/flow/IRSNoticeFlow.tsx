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

import { noticeNodes, noticeEdges, type NoticeNodeData } from "../../data/notices";
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

function buildNodes(showTiming: boolean): Node[] {
  return noticeNodes.map((n) => ({
    id: n.id,
    type: "noticeNode",
    position: n.position,
    data: { ...n, showTiming } as unknown as Record<string, unknown>,
    selectable: true,
    draggable: false,
  }));
}

function buildEdges(showTiming: boolean): Edge[] {
  return noticeEdges.map((e) => {
    const isEscalation = e.style === "escalation";
    const isResolution = e.style === "resolution";
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: "noticeEdge",
      data: {
        condition: e.condition,
        timing: e.timing ?? "",
        edgeStyle: e.style,
        showTiming,
      } as unknown as Record<string, unknown>,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: isEscalation
          ? palette.slateBlue
          : isResolution
          ? palette.sage
          : palette.muted,
      },
    };
  });
}

export function IRSNoticeFlow() {
  const [showTiming, setShowTiming] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NoticeNodeData | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(showTiming));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(showTiming));

  useEffect(() => {
    setNodes(buildNodes(showTiming));
    setEdges(buildEdges(showTiming));
  }, [showTiming, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    const data = node.data as unknown as NoticeNodeData;
    setSelectedNode((prev) => (prev?.id === data.id ? null : data));
  }, []);

  const onPaneClick = useCallback(() => {
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
      {/* Header */}
      <header
        style={{
          padding: "28px 32px 16px",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: palette.muted,
            margin: "0 0 6px",
            fontFamily: SANS,
          }}
        >
          An educational diagram · ariataxpa.com
        </p>
        <h1
          style={{
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "clamp(22px, 3.5vw, 34px)",
            fontWeight: 400,
            color: palette.ink,
            margin: "0 0 8px",
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
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          The IRS communicates through a defined sequence of notices. Each branch
          represents a decision point — paying, responding, or ignoring determines
          which path follows.
        </p>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <button
            onClick={() => setShowTiming((v) => !v)}
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              color: showTiming ? palette.slateBlue : palette.muted,
              background: showTiming ? "rgba(62,92,118,0.08)" : "transparent",
              border: `1px solid ${showTiming ? "rgba(62,92,118,0.25)" : palette.border}`,
              borderRadius: 20,
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 150ms ease",
              letterSpacing: "0.01em",
            }}
          >
            {showTiming ? "Hide timing" : "Show timing"}
          </button>
          <span
            style={{
              fontSize: 11,
              color: "#B0A998",
            }}
          >
            Click any node to learn more
          </span>
        </div>
      </header>

      {/* Flow canvas */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          borderTop: `1px solid ${palette.border}`,
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
          fitViewOptions={{
            padding: 0.12,
            minZoom: 0.3,
            maxZoom: 1.4,
          }}
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
          <Controls
            style={{
              button: {
                background: palette.paper,
                border: `1px solid ${palette.border}`,
                color: palette.muted,
              },
            }}
            showInteractive={false}
          />
          <Legend />
        </ReactFlow>

        {/* Detail panel */}
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}
