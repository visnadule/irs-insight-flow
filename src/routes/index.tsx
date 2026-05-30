import { createFileRoute } from "@tanstack/react-router";
import { IRSInformationHub } from "@/components/IRSInformationHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Where IRS Letters Come From" },
      { name: "description", content: "An educational diagram of how the IRS information matching system generates notices." },
    ],
  }),
  component: Index,
});

function Index() {
  return <IRSInformationHub />;
}
