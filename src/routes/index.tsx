import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { EmbedAutoResize } from "@/components/EmbedAutoResize";
import { DiagramOneLink } from "@/components/DiagramOneLink";

const IRSNoticeFlow = lazy(() =>
  import("@/components/flow/IRSNoticeFlow").then((m) => ({
    default: m.IRSNoticeFlow,
  }))
);

const IRSInformationHub = lazy(() =>
  import("@/components/IRSInformationHub").then((m) => ({
    default: m.IRSInformationHub,
  }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IRS Notice Educational Diagrams — ariataxpa.com" },
      {
        name: "description",
        content:
          "Two connected diagrams explaining why IRS notices are generated and how they escalate over time. An educational resource from ariataxpa.com.",
      },
    ],
  }),
  component: Index,
});

function LoadingDiagram() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontFamily: '"Inter", ui-sans-serif, sans-serif',
        fontSize: 13,
        color: "#9CA3AF",
      }}
    >
      Loading diagram…
    </div>
  );
}

function Index() {
  return (
    <>
      <EmbedAutoResize />

      {/* ── Diagram 1: Where IRS letters come from ────────────────────────── */}
      <div id="irs-diagram-1" style={{ width: "100%", minHeight: "100vh" }}>
        <Suspense fallback={<LoadingDiagram />}>
          <IRSInformationHub />
        </Suspense>
      </div>

      {/* ── Connection block ──────────────────────────────────────────────── */}
      <DiagramOneLink />

      {/* ── Diagram 2: How IRS notices escalate over time ─────────────────── */}
      <div
        id="irs-diagram-2"
        style={{
          width: "100%",
          height: "100vh",
          minHeight: 680,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={<LoadingDiagram />}>
          <IRSNoticeFlow />
        </Suspense>
      </div>
    </>
  );
}
