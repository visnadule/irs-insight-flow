Project Identity
Project name: Aria Tax Services — IRS Information System Visualization Project
Working title for the public page: Where IRS Letters Come From (alternates: How the IRS Sees You, How IRS Letters Happen).
Home site: ariataxpa.com
Sibling page: /irs-notice-help/ (already live; this new project is the upper conceptual layer above it).
Core Thesis (the one idea everything depends on)
IRS letters are not random punishments. They are predictable outputs of an information-matching system.
The IRS already knows most of a taxpayer's reportable income before the taxpayer files a return, because third parties (employers, banks, brokerages, payment processors, custodians) send information returns directly to the IRS. Letters appear in the gap between what the IRS already knows and what the taxpayer reports.
Once a reader sees the system this way, every letter becomes legible: an output of a matching process, not a surprise.
One-line version, useful as a tagline:
"The IRS often sees your transactions before it sees your explanation."
Pedagogical Frame
The project is:

causal (explains WHY, not just WHAT)
system-oriented (shows the architecture)
educational (teaches a mental model)
structured (information has clear hierarchy)
visually explanatory (pictures do real cognitive work)

The project is NOT:

reactive, procedural, or fear-based
a notice-by-notice encyclopedia
a tax-return tutorial
an audit-defense funnel
generic CPA marketing

Emotional goal: reduce fear through visibility, reduce ambiguity through structure, create calm understanding.
Audience

Curious learners — people who want to understand the system before getting a letter.
New business owners — fresh LLCs, contractors, side-income earners, payment-platform users.
Immigrants and first-time filers — people whose mental model came from a different tax system.
Calm users, not panicked users. Panicked users go to /irs-notice-help/.

Central Visual Concept
IRS sits in the center, framed not as enforcement but as an information processing and matching hub.
RIGHT SIDE — Third-party information flow (what the IRS already knows):
A visual stream of information returns arriving from outside parties. Top 10–12 forms to feature in depth:

W-2 (employers)
1099-NEC (clients of contractors)
1099-MISC (miscellaneous payers)
1099-K (payment platforms — Stripe, PayPal, Venmo for business)
1099-INT (banks)
1099-DIV (brokerages)
1099-R (retirement plan administrators)
1099-B (brokerages, securities sales)
1098 (mortgage lenders)
1098-T (educational institutions)
K-1 (partnerships, S-corps, trusts)

Other forms grouped into a single "Other informational returns" item.
Each form is a card. Expanded, it shows: what income/transaction it represents, typical mismatches it causes, which IRS notices typically result.
LEFT SIDE — Taxpayer contribution (split into two pedagogically distinct categories):

Compliance forms — the formal return: 1040, 1120-S, 1065, 1041, schedules and elections.
Personal circumstances — context the IRS does NOT receive from third parties: filing status, dependents, residency, life events, qualifying conditions, prior-year carryovers, casualty/disaster events. Cap this at 5–7 categories.

The left-side split is pedagogically critical. Most explanations conflate the two; separating them shows that the taxpayer contributes two different kinds of information, and that letters can result from gaps in either.
BELOW THE SCHEMA — The matching process and its outputs:

Common mismatch types: omitted 1099 income, duplicate forms, incorrect rollover treatment, EIN/SSN mismatch, missing K-1 income, education credit mismatch, payment-platform discrepancies.
Key notices to feature: CP2000, CP2501, CP14, CP501, CP503, CP504, LT11, CP05, CP75, CP12.
Two existing interactive components live here:

Notice Taxonomy — categorical reference (mismatch / balance-due escalation / refund-review / collection escalation / identity verification). Static expandable cards.
Notice Roadmap — communication timeline. Current form: horizontal stages (REVIEW → AUDIT → ADJUSTMENT → DEFICIENCY). Target evolution: a branching communication chain showing real timing, decision points, and resolution paths (e.g., CP504 → LT11 if unresolved, → resolution if taxpayer acts).



Cross-linking with /irs-notice-help/
This new page is Tier 1 (system-level, for learners). The existing /irs-notice-help/ is Tier 2 (action-level, for people with a letter in hand). Every notice mentioned on the new page links into /irs-notice-help/ via "See full walkthrough →". A banner on the existing page points back: "Want to understand the bigger picture? See How IRS Letters Happen →".
Visual Style
Atmosphere: intelligent, calm, educational, structured, trustworthy, non-corporate, non-aggressive.
Visual references:

museum educational systems
scientific explanatory diagrams
transit maps (Massimo Vignelli, Harry Beck)
information architecture
calm editorial design (think The New York Times explainer graphics, Stripe Press, Our World in Data)
interactive learning systems (Bret Victor, Nicky Case explorables)

Explicitly avoid:

fintech dashboards
startup SaaS / hero-with-gradient aesthetics
crypto UI, trading-terminal style
"scary IRS" or dark cyber visuals
red flashing warnings, alarm colors
legal-intimidation aesthetics

Typography: highly readable, editorial, educational. A modern serif for body or display works well (Source Serif, Tiempos, Lyon, Charter); pair with a clean humanist sans (Inter, IBM Plex Sans, Söhne) for UI/labels.
Color palette: muted professional. Soft blues, warm off-whites, charcoal text, restrained accent. Avoid danger reds and high-contrast warning palettes. Suggested seed values:

Background: #F7F5F0 (warm paper) or #FAFAFA (cool neutral)
Primary text: #1A1D24 or #222831
IRS hub accent: a calm slate-blue, e.g. #3E5C76 or #496A81
Third-party flow accent: a softer cool, e.g. #7A9CC6
Taxpayer flow accent: a warm muted ochre or sage, e.g. #A89B7C or #7D9A82
Notice/mismatch accent: NOT red. A restrained amber or terracotta only when semantically required, e.g. #B97A57

Spacing: breathable, layered, calm hierarchy. Generous line-height (1.5–1.7 for body). White space is content.
Animation: subtle, explanatory, flow-oriented. Information returns can drift gently toward the IRS hub. No decorative overload, no parallax theater, no scroll-jacking.
UX Principles

Overview first, details on demand. The reader sees the whole system before any single piece.
Progressive disclosure. Expandable cards, hover explanations, layered navigation.
Multiple entry points. A reader did not necessarily start at CP14; the visualization should accommodate that.
Time-aware roadmap. Where notices follow each other, show real-world timing (weeks, months), not instant arrows.
Decision-point clarity. Mark moments where the taxpayer can intervene.

Tone of Voice
DO: explain, clarify, orient, teach. Speak like an intelligent teacher, a systems explainer, a calm analyst.
DO NOT: pressure, frighten, sensationalize, catastrophize. No "the IRS is coming after you", no "urgent action required" unless literally describing a deadline, no "protect yourself now".
SEO Targets (higher-funnel than existing page)
Target queries include: "how IRS knows my income", "what is a 1099", "why IRS sends notices", "IRS information returns", "what triggers CP2000", "types of IRS letters", "IRS mismatch notice", "how IRS matching works".
Technical Direction
Acceptable building blocks:

React + Tailwind for interactive components
Static SVG for the central schema (first launch)
React Flow or D3.js for the Notice Roadmap chain
Replit for deployable iframe-embeddable apps
Figma / FigJam for layout and IA work
WordPress page as the final host, embedding iframes from Replit deployments

Suggested phasing:

Phase 1: Deploy Notice-Taxonomy and Notice-Roadmap as standalone Replit apps.
Phase 2: Build the new WordPress page; embed the schema (static SVG first) and the two Replit apps via iframe.
Phase 3: Evolve Notice-Roadmap from a staged list into a true branching communication chain.
Phase 4: Polish, monitor search console, optionally add a downloadable cheat sheet.

Anti-Brief (what NOT to produce)
If any AI tool starts generating any of the following, that output is wrong for this project:

gradient-heavy SaaS hero with floating phone mockups
"TurboTax-style" wizards or aggressive CTAs
dashboards with KPIs, deltas, and trending arrows
dark-mode cyberpunk or "hacker" IRS aesthetics
alarm-red boxes, exclamation icons, countdown timers
vague stock illustrations of stressed people at laptops
generic blog-post layouts with sidebars and "related posts"
anything resembling a tax-prep funnel

AI Collaboration Goal
When asked to generate a design, interface, diagram, flow, or component for this project, prioritize:
clarity, structure, educational sequencing, visual calmness, conceptual coherence, interaction readability.
De-prioritize:
flashy effects, maximalism, aggressive conversion UX, startup aesthetics, gamification.
The output should feel thoughtful, human, pedagogically intentional, trustworthy, intellectually elegant — closer to a museum exhibit or a Bret-Victor explorable than to a SaaS landing page.

