import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { EmbedAutoResize } from "@/components/EmbedAutoResize";
import { DiagramCallout } from "@/components/DiagramCallout";

const IRSNoticeFlow = lazy(() =>
  import("@/components/flow/IRSNoticeFlow").then((m) => ({
    default: m.IRSNoticeFlow,
  }))
);

export const Route = createFileRoute("/irs-notice-timeline")({
  head: () => ({
    meta: [
      { title: "IRS Notice Timeline — ariataxpa.com" },
      {
        name: "description",
        content:
          "An educational diagram showing how IRS notices escalate over time — from the first balance due notice through to enforced collection.",
      },
    ],
  }),
  component: IRSNoticeTimeline,
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

function IRSNoticeTimeline() {
  return (
    <>
      <EmbedAutoResize />

      <div
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

      <DiagramCallout
        title="Where did this notice come from?"
        body="IRS notices begin when information on your tax return does not match what employers, banks, brokers, and other third parties have already reported. This diagram shows how that mismatch process works."
        buttonLabel="See how IRS notices are generated →"
        href="/where-irs-letters-come-from"
      />
    </>
  );
}
