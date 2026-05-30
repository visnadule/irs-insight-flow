import { X } from "lucide-react";
import type { NoticeNodeData } from "../../data/notices";

const SERIF = '"Source Serif 4", "Georgia", serif';
const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';

const palette = {
  slateBlue: "#3E5C76",
  sage: "#7D9A82",
  terracotta: "#B97A57",
  paper: "#F7F5F0",
  ink: "#1A1D24",
  muted: "#6B7280",
  border: "#D8D2C8",
  white: "#FFFFFF",
  light: "#F0EDE6",
};

function accentForCategory(category: NoticeNodeData["category"]) {
  if (category === "end-resolved" || category === "end-refund")
    return palette.sage;
  if (category === "end-levy" || category === "end-court")
    return palette.terracotta;
  return palette.slateBlue;
}

interface Props {
  node: NoticeNodeData | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: Props) {
  if (!node) return null;

  const accent = accentForCategory(node.category);
  const isEnd =
    node.category === "end-resolved" ||
    node.category === "end-court" ||
    node.category === "end-levy" ||
    node.category === "end-refund";

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 300,
        maxHeight: "calc(100% - 32px)",
        overflowY: "auto",
        background: palette.white,
        border: `1.5px solid ${palette.border}`,
        borderRadius: 10,
        boxShadow: "0 4px 24px -8px rgba(26,29,36,0.18)",
        zIndex: 20,
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: `1px solid ${palette.border}`,
          background: palette.light,
          borderRadius: "8px 8px 0 0",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: palette.muted,
            padding: 4,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={14} />
        </button>

        {node.code && (
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            {node.code}
          </div>
        )}
        <h2
          style={{
            fontFamily: SERIF,
            fontSize: 16,
            fontWeight: 500,
            color: palette.ink,
            margin: 0,
            lineHeight: 1.3,
            paddingRight: 20,
          }}
        >
          {node.title}
        </h2>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1 }}>
        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: "#3F434B",
            lineHeight: 1.65,
            margin: "0 0 14px",
          }}
        >
          {node.description}
        </p>

        {/* Timing */}
        {!isEnd && (
          <div style={{ marginBottom: 14 }}>
            <SectionLabel>Typical timing</SectionLabel>
            <p
              style={{
                fontSize: 12,
                color: palette.muted,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {node.timing}
            </p>
          </div>
        )}

        {/* Options */}
        {node.options.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SectionLabel>Taxpayer options</SectionLabel>
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {node.options.map((opt, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "#3F434B",
                    lineHeight: 1.55,
                    listStyleType: "disc",
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        {!isEnd && (
          <a
            href="https://ariataxpa.com/irs-notice-help/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 500,
              color: accent,
              textDecoration: "none",
              borderBottom: `1px solid ${accent}`,
              paddingBottom: 1,
              lineHeight: 1.4,
            }}
          >
            See full walkthrough →
          </a>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "#9CA3AF",
        marginBottom: 5,
      }}
    >
      {children}
    </div>
  );
}
