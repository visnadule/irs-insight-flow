import { createFileRoute, Link } from "@tanstack/react-router";
import { EmbedAutoResize } from "@/components/EmbedAutoResize";

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

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
const SERIF = '"Source Serif 4", "Georgia", serif';

function Index() {
  return (
    <>
      <EmbedAutoResize />
      <div
        style={{
          fontFamily: SANS,
          backgroundColor: "#F7F5F0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 32px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6B7280",
              margin: "0 0 10px",
            }}
          >
            ariataxpa.com · Educational resources
          </p>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "#1A1D24",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Understanding IRS notices
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#3F434B",
              lineHeight: 1.7,
              margin: "0 0 48px",
              maxWidth: 560,
            }}
          >
            Two interactive diagrams that explain where IRS notices come from
            and how they escalate over time.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            <DiagramCard
              number="01"
              title="Where IRS letters come from"
              description="The IRS receives information from two sources — you and third parties. When the two do not match, a notice is generated."
              href="/where-irs-letters-come-from"
              buttonLabel="View diagram →"
            />
            <DiagramCard
              number="02"
              title="How IRS notices escalate over time"
              description="Once a notice is issued, a defined sequence follows. Each step escalates if left unresolved — from reminders to enforced collection."
              href="/irs-notice-timeline"
              buttonLabel="View diagram →"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function DiagramCard({
  number,
  title,
  description,
  href,
  buttonLabel,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #D8D2C8",
        borderRadius: 10,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#9CA3AF",
          letterSpacing: "0.08em",
        }}
      >
        {number}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 20,
          fontWeight: 400,
          color: "#1A1D24",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}
      >
        {description}
      </p>
      <Link
        to={href}
        style={{
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 500,
          color: "#FFFFFF",
          background: "#3E5C76",
          borderRadius: 6,
          padding: "9px 16px",
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          letterSpacing: "0.01em",
          transition: "background 150ms ease",
          alignSelf: "flex-start",
          marginTop: 4,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#334e63")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#3E5C76")}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
