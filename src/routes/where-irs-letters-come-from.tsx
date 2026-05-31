import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { EmbedAutoResize } from "@/components/EmbedAutoResize";
import { DiagramCallout } from "@/components/DiagramCallout";

const IRSInformationHub = lazy(() =>
  import("@/components/IRSInformationHub").then((m) => ({
    default: m.IRSInformationHub,
  }))
);

export const Route = createFileRoute("/where-irs-letters-come-from")({
  component: WhereIRSLettersComeFrom,
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

function WhereIRSLettersComeFrom() {
  return (
    <>
      <EmbedAutoResize />

      <div style={{ width: "100%", minHeight: "100vh" }}>
        <Suspense fallback={<LoadingDiagram />}>
          <IRSInformationHub />
        </Suspense>
      </div>

      <DiagramCallout
        title="What happens after a notice is generated?"
        body="Once the IRS detects a mismatch, it begins a defined sequence of notices. Each step escalates if left unresolved — from a first balance due notice all the way to enforced collection."
        buttonLabel="Explore the IRS Notice Timeline →"
        href="/irs-notice-timeline"
      />
    </>
  );
}
