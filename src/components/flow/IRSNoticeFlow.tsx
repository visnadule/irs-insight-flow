import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
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
  slateBlue:  "#3E5C76",
  sage:       "#4E7A55", // darkened from #7D9A82 — matches CustomEdge resolution colour
  terracotta: "#B97A57",
  paper:      "#F7F5F0",
  border:     "#D8D2C8",
  muted:      "#6B7280",
  neutral:    "#6A7A8A", // darkened from #9FA8B3 — matches CustomEdge neutral colour
  ink:        "#1A1D24",
};

// ─── Viewport-width breakpoints ───────────────────────────────────────────────

function useViewportWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ─── Auto-fit viewport ────────────────────────────────────────────────────────
// Each breakpoint targets a node subset that yields a legible initial zoom:
//   mobile  2 nodes (x 0–420) → zoom ≈ 0.74 → 12 px text renders at ~8.9 px  ✓
//   tablet  3 nodes (x 0–670) → zoom ≈ 0.99 → 12 px text renders at ~11.9 px ✓
//   desktop full diagram      → zoom ≈ 0.68 → fits all three tracks in view   ✓
// The user pans / zooms to explore the rest; minZoom allows enough zoom-out
// to see structure even if individual labels become small.

const MOBILE_FIT_NODES  = [{ id: "start-balance" }, { id: "cp14" }];
const TABLET_FIT_NODES  = [{ id: "start-balance" }, { id: "cp14" }, { id: "cp501" }];

function AutoFitViewport({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const { fitView } = useReactFlow();
  useLayoutEffect(() => {
    if (isMobile) {
      fitView({ nodes: MOBILE_FIT_NODES, padding: 0.10, duration: 0 });
    } else if (isTablet) {
      fitView({ nodes: TABLET_FIT_NODES, padding: 0.08, duration: 0 });
    } else {
      fitView({ padding: 0.06, duration: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

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

const NOTICE_NODE_W = 170;
const NOTICE_NODE_H = 56;

function buildNoticeNodes(selectedId: string | null, connectedNodeIds: Set<string>): Node[] {
  return noticeNodes.map((n) => {
    const dimmed = selectedId !== null && selectedId !== n.id && !connectedNodeIds.has(n.id);
    const highlighted = selectedId !== null && connectedNodeIds.has(n.id);
    return {
      id: n.id,
      type: "noticeNode",
      position: n.position,
      width: NOTICE_NODE_W,
      height: NOTICE_NODE_H,
      measured: { width: NOTICE_NODE_W, height: NOTICE_NODE_H },
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
    width: 80,
    height: 14,
    measured: { width: 80, height: 14 },
    data: { text: t.text, visible },
    selectable: false,
    draggable: false,
  }));
}

function buildEdges(selectedId: string | null, connectedEdgeIds: Set<string>): Edge[] {
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
                ? palette.sage        // darkened to #4E7A55
                : palette.neutral     // darkened to #6A7A8A
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

  const vpWidth = useViewportWidth();
  const isMobile = vpWidth < 640;
  const isTablet = vpWidth >= 640 && vpWidth < 1024;

  // minZoom floors: starting zoom is legible (see MOBILE/TABLET_FIT_NODES above);
  // the floor lets users zoom further out to see diagram structure as an overview.
  // At minZoom=0.45 on mobile, 12 px text renders at ~5.4 px — small but usable
  // as a navigational overview before pinching back in.
  const minZoom = isMobile ? 0.45 : isTablet ? 0.30 : 0.15;

  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...buildNoticeNodes(null, new Set()),
    ...buildTimingNodes(true),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(null, new Set()));

  // Rebuild when selection or timing changes
  useEffect(() => {
    const { edgeIds, nodeIds } = selectedId
      ? getConnected(selectedId)
      : { edgeIds: new Set<string>(), nodeIds: new Set<string>() };

    setNodes([...buildNoticeNodes(selectedId, nodeIds), ...buildTimingNodes(showTiming)]);
    setEdges(buildEdges(selectedId, edgeIds));
  }, [selectedId, showTiming, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      if (node.type === "timingNode") return;
      const data = node.data as unknown as NoticeNodeData;
      const next = selectedId === data.id ? null : data.id;
      setSelectedId(next);
      setSelectedNode(next ? data : null);
    },
    [selectedId],
  );

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
      <header
        style={{
          padding: isMobile ? "12px 16px 10px" : "24px 32px 14px",
          flexShrink: 0,
        }}
      >
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
            fontSize: isMobile ? "clamp(17px, 5vw, 22px)" : "clamp(20px, 3.2vw, 32px)",
            fontWeight: 400,
            color: palette.ink,
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          How IRS notices escalate over time
        </h1>

        {/* Description — hidden on mobile to save vertical space */}
        {!isMobile && (
          <p
            style={{
              fontSize: 13,
              color: palette.muted,
              margin: 0,
              maxWidth: 540,
              lineHeight: 1.6,
            }}
          >
            The IRS communicates through a defined sequence of notices. Each branch represents a
            decision point — paying, responding, or ignoring determines which path follows.
          </p>
        )}

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? 8 : 10,
            marginTop: isMobile ? 8 : 12,
          }}
        >
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
              padding: isMobile ? "6px 14px" : "4px 12px",
              cursor: "pointer",
              transition: "all 150ms ease",
              letterSpacing: "0.01em",
              // Larger touch target on mobile
              minHeight: isMobile ? 36 : undefined,
            }}
          >
            {showTiming ? "Hide timing" : "Show timing"}
          </button>
          <span style={{ fontSize: 11, color: "#B0A998" }}>
            {isMobile ? "Tap a node · pinch to zoom" : "Click any node to learn more"}
          </span>
          {selectedId && (
            <button
              onClick={() => {
                setSelectedId(null);
                setSelectedNode(null);
              }}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: palette.muted,
                background: "transparent",
                border: `1px solid ${palette.border}`,
                borderRadius: 20,
                padding: isMobile ? "6px 14px" : "4px 12px",
                cursor: "pointer",
                minHeight: isMobile ? 36 : undefined,
              }}
            >
              Clear ×
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
          overflow: "hidden",
          // touch-action:none tells the browser not to handle touch gestures
          // here; ReactFlow's own pointer handlers manage pan and pinch-zoom.
          // This prevents iOS Safari from triggering browser-level page zoom
          // when the user pinches inside the canvas.
          touchAction: "none",
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
          minZoom={minZoom}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: false }}
          style={{ background: "transparent" }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          zoomOnScroll
          zoomOnPinch
          panOnScroll={false}
          panOnDrag
          // preventScrolling (default true): ReactFlow registers its wheel
          // listener with { passive: false } on the canvas element, so
          // preventDefault() is NOT blocked by the cross-origin iframe
          // passive-listener restriction (which only applies to document/window
          // listeners in the outer frame). Keeping this default ensures
          // scroll-to-zoom works without the page racing to scroll instead.
        >
          <AutoFitViewport isMobile={isMobile} isTablet={isTablet} />
          <Controls showInteractive={false} />
          {/* Legend hidden on mobile — cramped and partially obscures nodes */}
          {!isMobile && <Legend />}
        </ReactFlow>

        {/* Detail panel */}
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => {
            setSelectedId(null);
            setSelectedNode(null);
          }}
        />
      </div>
    </div>
  );
}
