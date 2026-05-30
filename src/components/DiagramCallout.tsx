import { Link } from "@tanstack/react-router";

const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
const SERIF = '"Source Serif 4", "Georgia", serif';

const palette = {
  slateBlue: "#3E5C76",
  ink: "#1A1D24",
  muted: "#6B7280",
  border: "#D8D2C8",
  light: "#F0EDE6",
};

interface DiagramCalloutProps {
  title: string;
  body: string;
  buttonLabel: string;
  href: string;
}

export function DiagramCallout({ title, body, buttonLabel, href }: DiagramCalloutProps) {
  return (
    <div
      style={{
        fontFamily: SANS,
        padding: "48px 32px 40px",
        borderTop: `1px solid ${palette.border}`,
        background: palette.light,
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: palette.muted,
          margin: "0 0 6px",
        }}
      >
        Connected diagram
      </p>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(18px, 2.5vw, 26px)",
          fontWeight: 400,
          color: palette.ink,
          margin: "0 0 16px",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "#3F434B",
          lineHeight: 1.7,
          margin: "0 0 20px",
          maxWidth: 560,
        }}
      >
        {body}
      </p>
      <Link
        to={href}
        style={{
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 500,
          color: "#FFFFFF",
          background: palette.slateBlue,
          border: "none",
          borderRadius: 6,
          padding: "9px 18px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          letterSpacing: "0.01em",
          textDecoration: "none",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#334e63")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = palette.slateBlue)}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
