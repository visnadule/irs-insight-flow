/**
 * IRS Notice Communication Chain — editable data file
 *
 * HOW TO EDIT:
 * - Add or modify entries in `noticeNodes` to change node content.
 * - Add or modify entries in `noticeEdges` to change the flow connections.
 * - `position` controls placement on the canvas (x = right, y = down).
 * - `category` controls visual style: 'start' | 'notice' | 'end-resolved' | 'end-levy' | 'end-court' | 'end-refund'
 * - `timingAnnotations` adds the horizontal timing band below each track.
 */

export type NodeCategory =
  | "start"
  | "notice"
  | "end-resolved"
  | "end-levy"
  | "end-court"
  | "end-refund";

export type EdgeStyle = "escalation" | "resolution" | "neutral";

export interface NoticeNodeData {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  tooltip?: string;
  category: NodeCategory;
  description: string;
  timing: string;
  options: string[];
  position: { x: number; y: number };
}

export interface NoticeEdgeData {
  id: string;
  source: string;
  target: string;
  condition: string;
  timing?: string;
  style: EdgeStyle;
}

export interface TimingAnnotation {
  id: string;
  text: string;
  position: { x: number; y: number };
}

// ─── TIMING ANNOTATIONS (horizontal band below each track) ───────────────────
// Positioned midway between adjacent nodes, below the main track row.

// ── Timing annotation x positions are exact edge midpoints:
//    midpoint_x = (source_node_x + NODE_W + target_node_x) / 2
//    NODE_W ≈ 170px.  Column spacing = 250px.
//    col0=0, col1=250, col2=500, col3=750, col4=1000, col5=1250, col6=1500
//    col0→col1 midpoint: (170+250)/2 = 210
//    col1→col2 midpoint: (420+500)/2 = 460
//    col2→col3 midpoint: (670+750)/2 = 710
//    col3→col4 midpoint: (920+1000)/2 = 960
//    col4→col5 midpoint: (1170+1250)/2 = 1210
//    col5→col6 midpoint: (1420+1500)/2 = 1460

export const timingAnnotations: TimingAnnotation[] = [
  // Track 1 — Balance Due (nodes at y=0, timing band at y=90)
  { id: "t1-1", text: "≈3–6 weeks",    position: { x: 210, y: 90 } },
  { id: "t1-2", text: "≈5 weeks",       position: { x: 460, y: 90 } },
  { id: "t1-3", text: "≈5 weeks",       position: { x: 710, y: 90 } },
  { id: "t1-4", text: "≈5 weeks",       position: { x: 960, y: 90 } },
  { id: "t1-5", text: "≈5 weeks",       position: { x: 1210, y: 90 } },
  { id: "t1-6", text: "after hearing",  position: { x: 1460, y: 90 } },

  // Track 2 — AUR Mismatch (nodes at y=340, timing band at y=440)
  { id: "t2-1", text: "≈12–18 months",  position: { x: 210, y: 440 } },
  { id: "t2-2", text: "≈8 weeks",       position: { x: 460, y: 440 } },
  { id: "t2-3", text: "≈3–6 months",    position: { x: 710, y: 440 } },
  { id: "t2-4", text: "within 90 days", position: { x: 960, y: 440 } },

  // Track 3 — Review/Math (nodes at y=540–660, timing band at y=730)
  { id: "t3-1", text: "≈45–60 days",    position: { x: 210, y: 730 } },
  { id: "t3-2", text: "6–8 weeks",      position: { x: 460, y: 730 } },
];

// ─── NODE DEFINITIONS ────────────────────────────────────────────────────────
// Compact layout: horizontal spacing = 210px per column

export const noticeNodes: NoticeNodeData[] = [
  // ── START STATES ──────────────────────────────────────────────────────────

  {
    id: "start-balance",
    code: "",
    title: "Balance due on return",
    category: "start",
    description:
      "You filed a return showing tax owed to the IRS, or a return was assessed on your behalf with a balance due. The IRS collection sequence begins once this balance is confirmed.",
    timing: "Before any notices are sent",
    options: [
      "Pay the full balance to prevent the notice sequence",
      "File an amended return if the balance is incorrect",
      "Contact a tax professional before the first notice arrives",
    ],
    position: { x: 0, y: 0 },
  },
  {
    id: "start-mismatch",
    code: "",
    title: "Mismatch detected by AUR",
    subtitle: "Automated Underreporter Program",
    tooltip: "AUR is the IRS system that automatically compares third-party information returns against what was reported on the tax return.",
    category: "start",
    description:
      "The IRS Automated Underreporter (AUR) program compared your return against third-party information returns — W-2s, 1099s, and similar documents — and found a discrepancy. The program operates 12–18 months after the tax year closes, so this notice often arrives long after you filed.",
    timing: "≈12–18 months after the tax year ends",
    options: [
      "Gather all W-2s, 1099s, and supporting records for the tax year",
      "Review what the IRS believes you received versus what you reported",
      "Contact a tax professional before responding",
    ],
    position: { x: 0, y: 340 },
  },
  {
    id: "start-filed",
    code: "",
    title: "Return filed",
    category: "start",
    description:
      "A return has been filed that may contain a math or clerical error, a refund subject to offset, or credits requiring documentation. These notices arise during routine processing — they are not audits.",
    timing: "Upon filing",
    options: [
      "Keep copies of all forms submitted with your return",
      "Respond promptly if the IRS requests documentation",
    ],
    position: { x: 0, y: 580 },
  },

  // ── BALANCE DUE / COLLECTION NOTICES ──────────────────────────────────────

  {
    id: "cp14",
    code: "CP14",
    title: "First Balance Due Notice",
    category: "notice",
    description:
      "The CP14 is the IRS's first formal notice of an unpaid balance. It states the amount you owe including any penalties and interest that have already accrued. No enforced collection has begun. Responding quickly — either by paying or contacting the IRS — keeps your options open.",
    timing: "≈3–6 weeks after your return is processed",
    options: [
      "Pay the full amount to stop the notice sequence",
      "Set up an installment agreement at irs.gov/paymentplan",
      "Request penalty abatement if you have reasonable cause",
      "Contact a tax professional to review the balance",
    ],
    position: { x: 250, y: 0 },
  },
  {
    id: "cp501",
    code: "CP501",
    title: "First Reminder",
    category: "notice",
    description:
      "A reminder that a balance remains unpaid after CP14. The CP501 restates the amount owed and notes that additional action will follow if the balance is not resolved. Penalties and interest continue to accrue daily.",
    timing: "≈5 weeks after CP14, if unpaid",
    options: [
      "Pay in full to stop further notices and interest accrual",
      "Request an installment agreement",
      "Dispute the balance if you believe it is incorrect",
    ],
    position: { x: 500, y: 0 },
  },
  {
    id: "cp503",
    code: "CP503",
    title: "Second Reminder",
    category: "notice",
    description:
      "A second and more pointed reminder. The CP503 signals that the IRS is escalating toward enforcement. The language grows more direct, and the notice warns that collection action is approaching.",
    timing: "≈5 weeks after CP501, if unpaid",
    options: [
      "Pay in full immediately",
      "Apply for an installment agreement",
      "Explore an Offer in Compromise if you cannot pay the full amount",
      "Contact a tax professional — enforcement options are now close",
    ],
    position: { x: 750, y: 0 },
  },
  {
    id: "cp504",
    code: "CP504",
    title: "Intent to Levy State Tax Refunds",
    category: "notice",
    description:
      "A significant escalation. The CP504 is a legal notice of intent to levy your state tax refund and other property. It also triggers a lien search on your property. While full levy rights have not yet attached, this notice marks the transition from warnings to legal preparation.",
    timing: "≈5 weeks after CP503, if unpaid",
    options: [
      "Pay immediately to prevent the levy",
      "Request a Collection Due Process (CDP) hearing",
      "Apply for an installment agreement or Offer in Compromise",
      "Contact a tax professional without delay",
    ],
    position: { x: 1000, y: 0 },
  },
  {
    id: "lt11",
    code: "LT11",
    title: "Final Notice of Intent to Levy",
    category: "notice",
    description:
      "The LT11 (also issued as Letter 1058 or LT1058) is the final warning before enforced collection begins. It informs you of your right to request a Collection Due Process (CDP) hearing. The 30-day window to request that hearing begins on the date of this letter. If you do not respond, the IRS may levy wages, bank accounts, and other assets without further notice.",
    timing: "≈5 weeks after CP504, if unpaid",
    options: [
      "Request a Collection Due Process hearing within 30 days — this is a hard deadline",
      "Pay the full balance to stop all collection activity",
      "Explore last-resort options: Offer in Compromise, Currently Not Collectible status",
      "Contact a tax professional immediately — this notice has legal consequences",
    ],
    position: { x: 1250, y: 0 },
  },

  // ── AUR / UNDERREPORTER NOTICES ───────────────────────────────────────────

  {
    id: "cp2501",
    code: "CP2501",
    title: "AUR Soft Inquiry",
    subtitle: "soft inquiry",
    category: "notice",
    description:
      "The first contact in the Automated Underreporter process. The CP2501 asks you to review a discrepancy and explain or correct it. No proposed change to your tax has been made yet. This is a soft inquiry — it gives you an opportunity to respond before a formal adjustment is proposed.",
    timing: "≈12–18 months after the tax year ends",
    options: [
      "Gather all relevant W-2s, 1099s, and supporting documents",
      "Respond by the deadline printed on the notice",
      "Contact a tax professional to review your response before submitting",
    ],
    position: { x: 250, y: 340 },
  },
  {
    id: "cp2000",
    code: "CP2000",
    title: "Proposed Tax Adjustment",
    category: "notice",
    description:
      "The CP2000 formally proposes additional tax, penalties, and interest based on the AUR discrepancy. This is not yet an assessment — you may agree, partially agree, or disagree. If you agree, the IRS will assess the tax. If you disagree, you must provide documentation to support your position.",
    timing: "≈8 weeks after CP2501 (or after no response)",
    options: [
      "Agree and pay, or set up payment arrangements",
      "Partially agree and explain the portion you dispute",
      "Disagree by submitting supporting documentation with your signed response",
      "Request additional time to respond if needed",
      "Contact a tax professional to respond on your behalf",
    ],
    position: { x: 500, y: 340 },
  },
  {
    id: "cp3219a",
    code: "CP3219A",
    title: "Notice of Deficiency",
    category: "notice",
    description:
      "Also called the '90-day letter.' The CP3219A is a formal legal document stating that the IRS has determined you owe additional tax. You have 90 days (150 days if you are outside the United States) to petition the U.S. Tax Court to contest the amount. If you do not petition within that window, the IRS will assess the tax automatically.",
    timing: "≈3–6 months after CP2000, if unresolved",
    options: [
      "Petition U.S. Tax Court within 90 days — this is a firm statutory deadline",
      "Pay the proposed amount in full to stop the assessment clock",
      "Consult a tax professional immediately — this notice triggers court rights",
    ],
    position: { x: 750, y: 340 },
  },

  // ── REVIEW / CORRECTION NOTICES ───────────────────────────────────────────

  {
    id: "cp05",
    code: "CP05",
    title: "Return Selected for Review",
    category: "notice",
    description:
      "The CP05 notifies you that your return has been selected for review and that any expected refund is being held pending the outcome. No action is required unless the IRS subsequently requests documentation. The review typically completes within 60 days.",
    timing: "≈45–60 days after filing",
    options: [
      "Wait for the review to complete (no action needed unless requested)",
      "Contact the IRS after 60 days if you have not received an update",
      "Do not amend your return during the review period",
    ],
    position: { x: 250, y: 540 },
  },
  {
    id: "cp75",
    code: "CP75",
    title: "Credit Examination",
    category: "notice",
    description:
      "The CP75 requests documentation supporting one or more credits claimed on your return — most commonly the Earned Income Tax Credit, American Opportunity Credit, or dependency-based credits. Your refund is held until the documentation is reviewed and accepted.",
    timing: "≈60 days after filing",
    options: [
      "Gather and submit all requested documents by the deadline on the notice",
      "Request a deadline extension in writing if you need more time",
      "Contact a tax professional if the credit documentation is complex",
    ],
    position: { x: 250, y: 660 },
  },
  {
    id: "cp12",
    code: "CP12",
    title: "Math Error Correction",
    category: "notice",
    description:
      "The CP12 notifies you of a math or clerical correction the IRS made to your return. The correction may result in a smaller refund, a larger refund, or a balance due. This is not an audit — it is a routine computational adjustment.",
    timing: "≈6–8 weeks after filing",
    options: [
      "Review the corrected figures carefully",
      "If you agree, no action is required",
      "Dispute the correction within 60 days if you believe it is wrong",
    ],
    position: { x: 500, y: 540 },
  },
  {
    id: "cp49",
    code: "CP49",
    title: "Refund Applied to Debt",
    category: "notice",
    description:
      "The CP49 notifies you that your expected refund was fully or partially applied to a federal tax debt from a prior year through a process called a Treasury Offset. Any remaining refund will be issued separately.",
    timing: "During refund processing",
    options: [
      "Review which debt was offset — it will be identified in the notice",
      "Contact the IRS if you believe the offset was applied in error",
      "Contact the Bureau of Fiscal Service for non-IRS debts (student loans, child support)",
    ],
    position: { x: 500, y: 660 },
  },

  // ── END STATES ────────────────────────────────────────────────────────────

  {
    id: "end-resolved",
    code: "",
    title: "Resolved",
    category: "end-resolved",
    description:
      "The balance has been fully paid or an acceptable arrangement has been established — such as an installment agreement, Offer in Compromise, or Currently Not Collectible status. No further collection action will be taken while the arrangement remains in good standing.",
    timing: "As soon as payment or arrangement is confirmed",
    options: [
      "Keep records of your payment or agreement confirmation",
      "Make installment payments on time — missed payments can restart the notice sequence",
      "Monitor your IRS account for any remaining balance at irs.gov/account",
    ],
    position: { x: 1500, y: 200 },
  },
  {
    id: "end-court",
    code: "",
    title: "Tax Court petition window",
    category: "end-court",
    description:
      "The 90-day window to petition the U.S. Tax Court has been triggered. Filing a petition suspends IRS collection activity during the court process. Tax Court is accessible without a lawyer, though professional representation is strongly recommended for contested amounts.",
    timing: "90-day window from the date of the Notice of Deficiency",
    options: [
      "File a Tax Court petition at ustaxcourt.gov within the 90-day window",
      "Consider paying the disputed amount and filing a refund claim instead",
      "Retain a tax attorney or enrolled agent for court representation",
    ],
    position: { x: 1000, y: 490 },
  },
  {
    id: "end-levy",
    code: "",
    title: "Levy / Enforced Collection",
    category: "end-levy",
    description:
      "The IRS proceeds with enforced collection. This may include wage garnishment, bank account levies, or seizure of other assets. Certain rights remain — you may still request a Collection Due Process hearing, file an Innocent Spouse claim, or seek a levy release if you can demonstrate hardship.",
    timing: "After the 30-day CDP window closes with no response",
    options: [
      "Request a CDP hearing — still available after levy in some circumstances",
      "Contact the IRS Taxpayer Advocate Service if the levy creates economic hardship",
      "Contact a tax professional immediately",
    ],
    position: { x: 1500, y: 0 },
  },
  {
    id: "end-refund",
    code: "",
    title: "Refund issued / adjusted",
    category: "end-refund",
    description:
      "The review, correction, or offset process is complete. A refund has been issued, adjusted, or applied to an existing balance. No further action is required unless you disagree with the outcome.",
    timing: "After review completion or correction processing",
    options: [
      "Verify the refund amount matches what you expected",
      "Dispute the adjustment within 60 days if you disagree",
    ],
    position: { x: 750, y: 580 },
  },
];

// ─── EDGE DEFINITIONS ────────────────────────────────────────────────────────

export const noticeEdges: NoticeEdgeData[] = [
  // Balance due → CP14
  {
    id: "e-balance-cp14",
    source: "start-balance",
    target: "cp14",
    condition: "first notice",
    timing: "≈3–6 weeks",
    style: "escalation",
  },

  // CP14 branches
  {
    id: "e-cp14-cp501",
    source: "cp14",
    target: "cp501",
    condition: "if unpaid",
    timing: "≈5 weeks",
    style: "escalation",
  },
  {
    id: "e-cp14-resolved",
    source: "cp14",
    target: "end-resolved",
    condition: "if paid",
    style: "resolution",
  },

  // CP501 branches
  {
    id: "e-cp501-cp503",
    source: "cp501",
    target: "cp503",
    condition: "if unpaid",
    timing: "≈5 weeks",
    style: "escalation",
  },
  {
    id: "e-cp501-resolved",
    source: "cp501",
    target: "end-resolved",
    condition: "if paid",
    style: "resolution",
  },

  // CP503 branches
  {
    id: "e-cp503-cp504",
    source: "cp503",
    target: "cp504",
    condition: "if unpaid",
    timing: "≈5 weeks",
    style: "escalation",
  },
  {
    id: "e-cp503-resolved",
    source: "cp503",
    target: "end-resolved",
    condition: "if paid",
    style: "resolution",
  },

  // CP504 branches
  {
    id: "e-cp504-lt11",
    source: "cp504",
    target: "lt11",
    condition: "if unpaid",
    timing: "≈5 weeks",
    style: "escalation",
  },
  {
    id: "e-cp504-resolved",
    source: "cp504",
    target: "end-resolved",
    condition: "if paid",
    style: "resolution",
  },

  // LT11 branches
  {
    id: "e-lt11-levy",
    source: "lt11",
    target: "end-levy",
    condition: "no CDP hearing",
    timing: "after 30 days",
    style: "escalation",
  },
  {
    id: "e-lt11-court",
    source: "lt11",
    target: "end-court",
    condition: "if CDP requested",
    timing: "within 30 days",
    style: "neutral",
  },
  {
    id: "e-lt11-resolved",
    source: "lt11",
    target: "end-resolved",
    condition: "if paid in full",
    style: "resolution",
  },

  // AUR mismatch → CP2501
  {
    id: "e-mismatch-cp2501",
    source: "start-mismatch",
    target: "cp2501",
    condition: "soft inquiry",
    timing: "≈12–18 months",
    style: "neutral",
  },

  // CP2501 → CP2000
  {
    id: "e-cp2501-cp2000",
    source: "cp2501",
    target: "cp2000",
    condition: "if no response",
    timing: "≈8 weeks",
    style: "escalation",
  },

  // CP2000 branches
  {
    id: "e-cp2000-cp3219a",
    source: "cp2000",
    target: "cp3219a",
    condition: "if disputed",
    timing: "≈3–6 months",
    style: "escalation",
  },
  {
    id: "e-cp2000-resolved",
    source: "cp2000",
    target: "end-resolved",
    condition: "if agreed",
    style: "resolution",
  },

  // CP3219A branches
  {
    id: "e-cp3219a-court",
    source: "cp3219a",
    target: "end-court",
    condition: "if petitioned",
    timing: "within 90 days",
    style: "neutral",
  },
  {
    id: "e-cp3219a-resolved",
    source: "cp3219a",
    target: "end-resolved",
    condition: "if agreed & paid",
    style: "resolution",
  },

  // Review / math error chain
  {
    id: "e-filed-cp05",
    source: "start-filed",
    target: "cp05",
    condition: "if under review",
    timing: "≈45–60 days",
    style: "neutral",
  },
  {
    id: "e-filed-cp75",
    source: "start-filed",
    target: "cp75",
    condition: "if credit claimed",
    timing: "≈60 days",
    style: "neutral",
  },
  {
    id: "e-filed-cp12",
    source: "start-filed",
    target: "cp12",
    condition: "if math error",
    timing: "≈6–8 weeks",
    style: "neutral",
  },
  {
    id: "e-filed-cp49",
    source: "start-filed",
    target: "cp49",
    condition: "if prior debt",
    timing: "during processing",
    style: "neutral",
  },

  // Review exits → Refund
  {
    id: "e-cp05-refund",
    source: "cp05",
    target: "end-refund",
    condition: "if review passes",
    style: "resolution",
  },
  {
    id: "e-cp75-refund",
    source: "cp75",
    target: "end-refund",
    condition: "if docs accepted",
    style: "resolution",
  },
  {
    id: "e-cp12-refund",
    source: "cp12",
    target: "end-refund",
    condition: "after correction",
    style: "resolution",
  },
  {
    id: "e-cp49-refund",
    source: "cp49",
    target: "end-refund",
    condition: "remaining refund",
    style: "resolution",
  },
];
