import { useState, useRef, useLayoutEffect, useId } from "react";
import { FileText, Users, Building2, Landmark, Receipt, GraduationCap, PiggyBank, TrendingUp, Briefcase, Wallet, Coins, FileStack } from "lucide-react";

type Side = "left" | "right";

type CardData = {
  id: string;
  code: string;
  title: string;
  source: string;
  represents: string;
  mismatches: string[];
  notices: string[];
  icon?: React.ComponentType<{ className?: string }>;
};

const taxpayerCards: { group: string; items: CardData[] }[] = [
  {
    group: "Compliance forms",
    items: [
      { id: "f1040", code: "1040", title: "Individual return", icon: FileText, source: "Filed by the taxpayer", represents: "Annual personal income, deductions, and credits.", mismatches: ["Unreported 1099 income", "Incorrect filing status", "Math/entry errors"], notices: ["CP11", "CP14", "CP2000"] },
      { id: "f1120s", code: "1120-S", title: "S-corp return", icon: Building2, source: "Filed by S-corporations", represents: "Pass-through business income to shareholders via K-1.", mismatches: ["K-1 amounts not reported on 1040", "Late filing"], notices: ["CP162", "CP2000"] },
      { id: "f1065", code: "1065", title: "Partnership return", icon: Users, source: "Filed by partnerships", represents: "Pass-through partnership income reported via K-1.", mismatches: ["Missing K-1 on partner return", "Basis discrepancies"], notices: ["CP162", "CP2000"] },
      { id: "f1041", code: "1041", title: "Estate / trust", icon: Landmark, source: "Filed by fiduciaries", represents: "Income of an estate or trust and beneficiary distributions.", mismatches: ["Beneficiary K-1 omissions"], notices: ["CP2000"] },
    ],
  },
  {
    group: "Personal circumstances",
    items: [
      { id: "pc1", code: "Status", title: "Filing status", source: "Self-reported on 1040", represents: "Single, MFJ, MFS, HoH, or qualifying surviving spouse.", mismatches: ["HoH claimed without qualifying person", "MFS vs MFJ conflicts"], notices: ["CP87A", "CP75"] },
      { id: "pc2", code: "Deps", title: "Dependents", source: "Self-reported on 1040", represents: "Qualifying children and relatives claimed for credits.", mismatches: ["Same dependent claimed twice", "Residency tests failed"], notices: ["CP87A", "CP75A"] },
      { id: "pc3", code: "Resid.", title: "Residency", source: "Self-reported", represents: "State and federal residency, including foreign status.", mismatches: ["Substantial presence test", "Treaty positions"], notices: ["CP59"] },
      { id: "pc4", code: "Life", title: "Life events", source: "Self-reported", represents: "Marriage, divorce, birth, death, relocation.", mismatches: ["Mid-year status changes not reflected"], notices: ["CP12"] },
      { id: "pc5", code: "Qual.", title: "Qualifying conditions", source: "Self-reported with documentation", represents: "Disability, student status, and other credit eligibility factors.", mismatches: ["Documentation not retained on request"], notices: ["CP75"] },
    ],
  },
];

const thirdPartyCards: CardData[] = [
  { id: "w2", code: "W-2", title: "Wages", icon: Briefcase, source: "From employers", represents: "Wages, salary, tips, and federal/state withholding.", mismatches: ["Wages omitted on 1040", "Withholding entered incorrectly"], notices: ["CP2000", "CP14"] },
  { id: "nec", code: "1099-NEC", title: "Nonemployee comp.", icon: Receipt, source: "From clients and payers", represents: "Self-employment income of $600 or more.", mismatches: ["Schedule C income understated", "SE tax missing"], notices: ["CP2000"] },
  { id: "misc", code: "1099-MISC", title: "Miscellaneous", icon: FileText, source: "From payers", represents: "Rents, royalties, prizes, and other payments.", mismatches: ["Rental income omitted on Schedule E"], notices: ["CP2000"] },
  { id: "k", code: "1099-K", title: "Payment cards", icon: Wallet, source: "From payment processors", represents: "Gross payments through cards and third-party networks.", mismatches: ["Gross vs net reporting", "Personal transfers misclassified"], notices: ["CP2000"] },
  { id: "int", code: "1099-INT", title: "Interest", icon: PiggyBank, source: "From banks", represents: "Interest income of $10 or more.", mismatches: ["Interest under $10 not auto-reported", "Joint account allocation"], notices: ["CP2000"] },
  { id: "div", code: "1099-DIV", title: "Dividends", icon: Coins, source: "From brokerages", represents: "Ordinary and qualified dividends, capital gain distributions.", mismatches: ["Qualified vs ordinary classification"], notices: ["CP2000"] },
  { id: "r", code: "1099-R", title: "Retirement", icon: PiggyBank, source: "From plan administrators", represents: "Distributions from pensions, IRAs, and retirement plans.", mismatches: ["Rollovers reported as taxable", "Early withdrawal penalty"], notices: ["CP2000"] },
  { id: "b", code: "1099-B", title: "Broker sales", icon: TrendingUp, source: "From brokerages", represents: "Proceeds from sales of securities and cost basis.", mismatches: ["Cost basis missing or wrong", "Wash sales not adjusted"], notices: ["CP2000"] },
  { id: "1098", code: "1098", title: "Mortgage interest", icon: Landmark, source: "From mortgage lenders", represents: "Mortgage interest, points, and mortgage insurance.", mismatches: ["Itemized vs standard deduction", "Multiple borrowers"], notices: ["CP2000"] },
  { id: "1098t", code: "1098-T", title: "Tuition", icon: GraduationCap, source: "From educational institutions", represents: "Qualified tuition and related expenses.", mismatches: ["AOTC/LLC eligibility", "Scholarships netted incorrectly"], notices: ["CP2000", "CP75"] },
  { id: "k1", code: "K-1", title: "Pass-through", icon: FileStack, source: "From partnerships, S-corps, trusts", represents: "Allocable share of entity income, deductions, credits.", mismatches: ["K-1 received late and omitted"], notices: ["CP2000"] },
  { id: "other", code: "Other", title: "Other informational returns", icon: FileText, source: "From various third parties", represents: "1099-G, 1099-S, 1099-SA, 5498, and others.", mismatches: ["State refunds, HSA distributions, real estate sales"], notices: ["CP2000"] },
];

export function IRSInformationHub() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hubOpen, setHubOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<{ id: string; d: string; side: Side }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const svgId = useId();

  useLayoutEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      const hub = hubRef.current;
      if (!container || !hub) return;
      const cb = container.getBoundingClientRect();
      const hb = hub.getBoundingClientRect();
      const hubX = hb.left + hb.width / 2 - cb.left;
      const hubY = hb.top + hb.height / 2 - cb.top;
      const next: { id: string; d: string; side: Side }[] = [];
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const rb = el.getBoundingClientRect();
        const side: Side = rb.left + rb.width / 2 < cb.left + cb.width / 2 ? "left" : "right";
        const x = side === "left" ? rb.right - cb.left : rb.left - cb.left;
        const y = rb.top + rb.height / 2 - cb.top;
        const cx = (x + hubX) / 2;
        const d = `M ${x},${y} C ${cx},${y} ${cx},${hubY} ${hubX},${hubY}`;
        next.push({ id, d, side });
      });
      setLines(next);
      setSize({ w: cb.width, h: cb.height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [openId, hubOpen]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      className="w-full px-6 py-16 md:py-24"
      style={{ backgroundColor: "#F7F5F0", color: "#1A1D24", fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 md:mb-16">
          <p className="mb-3 text-xs tracking-wide" style={{ color: "#6B7280" }}>
            An educational diagram
          </p>
          <h1
            className="text-3xl md:text-5xl font-normal leading-tight"
            style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', color: "#1A1D24" }}
          >
            Where IRS letters come from
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg" style={{ lineHeight: 1.7, color: "#3F434B" }}>
            Two streams of information reach the IRS before any notice is sent. One comes from you. The other arrives from third parties. Letters are generated when the two do not agree.
          </p>
        </header>

        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden md:block motion-reduce:hidden"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            <defs>
              <linearGradient id={`${svgId}-base`} x1="0" x2="1">
                <stop offset="0%" stopColor="#C9C3B5" />
                <stop offset="100%" stopColor="#C9C3B5" />
              </linearGradient>
            </defs>
            {lines.map((l) => {
              const active = hoverId === l.id || openId === l.id;
              return (
                <path
                  key={l.id}
                  d={l.d}
                  fill="none"
                  stroke={active ? "#3E5C76" : "#CFC9BB"}
                  strokeWidth={active ? 1.25 : 0.75}
                  style={{ transition: "stroke 220ms ease, stroke-width 220ms ease" }}
                />
              );
            })}
          </svg>

          {/* LEFT */}
          <div className="md:col-span-4 relative z-10 space-y-8">
            {taxpayerCards.map((group) => (
              <div key={group.group}>
                <h2
                  className="mb-4 text-sm font-medium tracking-wide"
                  style={{ color: "#6B6B6B", fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: "italic" }}
                >
                  {group.group}
                </h2>
                <ul className="space-y-3">
                  {group.items.map((c) => (
                    <CardItem
                      key={c.id}
                      card={c}
                      side="left"
                      accent="#7D9A82"
                      open={openId === c.id}
                      onToggle={() => toggle(c.id)}
                      onHover={setHoverId}
                      registerRef={(el) => (cardRefs.current[c.id] = el)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CENTER */}
          <div className="md:col-span-4 relative z-10 flex flex-col items-center justify-start md:pt-12">
            <button
              ref={hubRef}
              onClick={() => setHubOpen((v) => !v)}
              aria-expanded={hubOpen}
              className="group flex flex-col items-center justify-center rounded-full text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: 200,
                height: 200,
                backgroundColor: "#3E5C76",
                color: "#F7F5F0",
                border: "1px solid #2E4860",
                boxShadow: hubOpen ? "0 6px 24px -12px rgba(62,92,118,0.5)" : "0 2px 10px -6px rgba(26,29,36,0.25)",
              }}
            >
              <span
                className="text-3xl"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: "0.05em" }}
              >
                IRS
              </span>
              <span className="mt-2 px-6 text-xs leading-relaxed" style={{ opacity: 0.85 }}>
                Information matching system
              </span>
            </button>

            {hubOpen && (
              <div
                className="mt-6 max-w-xs rounded-lg p-5 text-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E0DCD3",
                  color: "#1A1D24",
                  lineHeight: 1.7,
                  fontFamily: '"Source Serif 4", Georgia, serif',
                }}
              >
                The IRS receives information from third parties before you file. When the income you report does not match what they already have, the system generates a notice.
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="md:col-span-4 relative z-10">
            <h2
              className="mb-4 text-sm font-medium tracking-wide"
              style={{ color: "#6B6B6B", fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: "italic" }}
            >
              Information returns
            </h2>
            <ul className="space-y-3">
              {thirdPartyCards.map((c) => (
                <CardItem
                  key={c.id}
                  card={c}
                  side="right"
                  accent="#7A9CC6"
                  open={openId === c.id}
                  onToggle={() => toggle(c.id)}
                  onHover={setHoverId}
                  registerRef={(el) => (cardRefs.current[c.id] = el)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardItem({
  card,
  side,
  accent,
  open,
  onToggle,
  onHover,
  registerRef,
}: {
  card: CardData;
  side: Side;
  accent: string;
  open: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const Icon = card.icon;
  return (
    <li>
      <button
        ref={registerRef as (el: HTMLButtonElement | null) => void}
        onClick={onToggle}
        onMouseEnter={() => onHover(card.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(card.id)}
        onBlur={() => onHover(null)}
        aria-expanded={open}
        className="group w-full rounded-lg px-4 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${open ? accent : "#E0DCD3"}`,
          boxShadow: open ? "0 2px 14px -10px rgba(26,29,36,0.35)" : "none",
        }}
      >
        <div className={`flex items-center gap-3 ${side === "right" ? "flex-row" : "flex-row"}`}>
          {Icon && (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${accent}1A`, color: accent }}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: accent, fontFamily: '"Source Serif 4", Georgia, serif' }}
              >
                {card.code}
              </span>
              <span className="truncate text-sm" style={{ color: "#1A1D24" }}>
                {card.title}
              </span>
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg p-4 text-sm"
          style={{
            backgroundColor: "#FBF9F4",
            border: "1px solid #E0DCD3",
            color: "#3F434B",
            lineHeight: 1.65,
          }}
        >
          <DetailRow label="Source" value={card.source} />
          <DetailRow label="Represents" value={card.represents} />
          <DetailRow label="Common mismatches" value={card.mismatches.join(" · ")} />
          <DetailRow
            label="Typical notices"
            value={
              <span className="inline-flex flex-wrap gap-1.5">
                {card.notices.map((n) => (
                  <span
                    key={n}
                    className="rounded px-1.5 py-0.5 text-xs"
                    style={{ backgroundColor: "#EFEADF", border: "1px solid #E0DCD3", color: "#3E5C76" }}
                  >
                    {n}
                  </span>
                ))}
              </span>
            }
          />
        </div>
      )}
    </li>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <div
        className="mb-0.5 text-[11px] uppercase tracking-wide"
        style={{ color: "#8A8A8A", letterSpacing: "0.08em" }}
      >
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}

export default IRSInformationHub;
