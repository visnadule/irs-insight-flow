import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { EmbedAutoResize } from "@/components/EmbedAutoResize";

const IRSNoticeFlow = lazy(() =>
  import("@/components/flow/IRSNoticeFlow").then((m) => ({
    default: m.IRSNoticeFlow,
  }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "How IRS Notices Escalate Over Time" },
      {
        name: "description",
        content:
          "An interactive diagram of the IRS notice communication chain — how letters escalate from first balance due through enforced collection.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <EmbedAutoResize />
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontFamily: '"Inter", ui-sans-serif, sans-serif',
                fontSize: 13,
                color: "#6B7280",
              }}
            >
              Loading diagram…
            </div>
          }
        >
          <IRSNoticeFlow />
        </Suspense>
      </div>
    </>
  );
}
