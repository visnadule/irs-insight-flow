---
name: IRS Diagram 2 layout conventions
description: How the notice flow diagram is structured — timing rows, active highlighting, connection to Diagram 1
---

## Timing annotations
Timing labels (≈3–6 weeks, ≈5 weeks, etc.) are rendered as separate React Flow nodes of type `timingNode` (TimingLabelNode in CustomNodes.tsx). They are NOT edge labels. Positions are defined in `src/data/notices.ts` → `timingAnnotations` array. They are inserted into the nodes array in IRSNoticeFlow.tsx via `buildTimingNodes(showTiming)`. When `showTiming` is false, the nodes have `data.visible = false`, which sets opacity: 0 via CSS transition.

**Why:** Edge labels on horizontal bezier paths overlapped nodes and were hard to read at scale. Separate annotation nodes placed midway between adjacent nodes in a dedicated y-band are cleaner and don't interfere with edge routing.

## Active path highlighting
`selectedId` state in IRSNoticeFlow.tsx. On change, `getConnected(nodeId)` traverses `noticeEdges` to find directly connected edge IDs and node IDs. Then `buildNoticeNodes` and `buildEdges` apply `dimmed: true` to non-connected items, `highlighted: true` to connected items. CustomNodes and CustomEdge read these flags for opacity/stroke-width changes.

## Page structure
- `routes/index.tsx` stacks: (1) 100vh div → IRSNoticeFlow, (2) DiagramOneLink, (3) `id="irs-diagram-1"` div → IRSInformationHub
- DiagramOneLink has a button that `scrollIntoView` the `#irs-diagram-1` element
- All diagrams are on the same page for iframe embed convenience

## Layout coordinates (Track y-positions)
- Track 1 (Balance Due): nodes at y=0, timing band at y=90
- end-resolved at (1260, 190) — between tracks 1 and 2
- Track 2 (AUR): nodes at y=320, timing band at y=410
- end-court at (840, 440)
- Track 3 (Review): nodes at y=475-580, timing band at y=660
- Horizontal node spacing: 210px per column
