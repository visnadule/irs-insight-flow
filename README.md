# IRS Notice Communication Chain

An interactive diagram visualizing how IRS notices escalate over time — from first balance due through enforced collection. Built for [ariataxpa.com](https://ariataxpa.com/irs-notice-help/).

**Tech stack:** Vite + React + TypeScript + Tailwind CSS + @xyflow/react (React Flow)

---

## 1. How to Edit the Notice Data

All content — node text, timing, options, and edge conditions — lives in one file:

```
src/data/notices.ts
```

### Edit a notice description

Find the entry in `noticeNodes` by its `id` and update any fields:

```typescript
{
  id: "cp14",
  code: "CP14",
  title: "First Balance Due Notice",
  description: "...",    // plain-English paragraph shown in the detail panel
  timing: "≈3–6 weeks after your return is processed",
  options: [             // bullet list of taxpayer options
    "Pay the full amount to stop the notice sequence",
    "Set up an installment agreement at irs.gov/paymentplan",
  ],
  position: { x: 260, y: 0 },  // canvas position — adjust to reposition the node
}
```

### Add a new notice node

Copy an existing entry in `noticeNodes`, give it a unique `id`, set a `position`,
then add edges to/from it in `noticeEdges`.

### Edit an edge (connection between notices)

Find the entry in `noticeEdges` by its `id`:

```typescript
{
  id: "e-cp14-cp501",
  source: "cp14",          // node id where edge starts
  target: "cp501",         // node id where edge ends
  condition: "if unpaid",  // short label shown on the edge
  timing: "≈5 weeks",      // shown when "Show timing" is on
  style: "escalation",     // "escalation" | "resolution" | "neutral"
}
```

- `escalation` — darker solid line (IRS ramping up pressure)
- `resolution` — lighter dashed line (taxpayer resolves the matter)
- `neutral` — medium gray line (review / informational)

### Node categories

| `category`      | Visual style                          |
|-----------------|---------------------------------------|
| `start`         | Warm gray background — starting state |
| `notice`        | White background — IRS notice         |
| `end-resolved`  | Sage green — resolved / refund        |
| `end-refund`    | Sage green — refund issued            |
| `end-levy`      | Terracotta — enforced collection      |
| `end-court`     | Terracotta — Tax Court petition       |

---

## 2. How to Embed via iframe with Auto-Resize

The app includes an `EmbedAutoResize` component that posts the page height
to the parent window via `postMessage` whenever the content size changes.

### WordPress — Custom HTML block

Paste this into a **Custom HTML** block on your WordPress page:

```html
<iframe
  id="irs-flow-frame"
  src="https://your-app.replit.app"
  style="width:100%; border:none; min-height:200px; display:block;"
  scrolling="no"
  allowtransparency="true"
></iframe>

<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'irsFlowHeight') {
      document.getElementById('irs-flow-frame').style.height = e.data.height + 'px';
    }
  });
</script>
```

The app background is `transparent`, so the WordPress page's background color
will show through. Set a `min-height` that covers the loading state (200–400px
is a good starting point).

### Fixed-height alternative

If auto-resize causes layout issues, use a fixed height instead:

```html
<iframe
  src="https://your-app.replit.app"
  style="width:100%; height:700px; border:none; display:block;"
  scrolling="no"
  allowtransparency="true"
></iframe>
```

The React Flow canvas is pannable and zoomable, so a fixed height of 600–800px
works well for most page widths.

---

## 3. How to Update the Deployment

### Development

```bash
bun install       # install dependencies
bun run dev       # starts at http://localhost:5000
```

### Deploy to Replit

1. Click the **Deploy** button in the Replit header, or run:
   ```bash
   bun run build   # builds the production bundle
   ```
2. Replit Deployments handles hosting, TLS, and the `.replit.app` domain automatically.
3. After deploying, update the `src` URL in your WordPress iframe embed.

### Build output

The build command (`bun run build`) produces a Nitro server bundle in `.output/`.
The preview command (`bun run preview`) serves the production build locally for
verification before deploying.

---

## Project structure

```
src/
  data/
    notices.ts              ← Edit notice content here
  components/
    flow/
      IRSNoticeFlow.tsx     ← Main diagram component
      CustomNodes.tsx       ← Node visual styles
      CustomEdge.tsx        ← Edge with condition/timing label
      NodeDetailPanel.tsx   ← Click-to-expand detail sidebar
      Legend.tsx            ← Corner legend
    EmbedAutoResize.tsx     ← postMessage height helper for iframe
  routes/
    index.tsx               ← Page entry point
    __root.tsx              ← HTML shell + fonts
  styles.css                ← Global styles + Tailwind
```
