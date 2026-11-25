# Vantage Transport Management console — demo build

> **Branch `gain/reseed` (25 Nov 2026): re-seeded for the Gain demo.** Every branch
> name, vehicle, consignment, SKU and figure is **illustrative, not Gain's records**,
> and the chrome says so on every screen. The shared identity map is
> `../GAIN-RESEED.md`. TVSH's real data has been removed from this branch.

> ## ⚠⚠ This is a temporary demo. It is not the module.
>
> It was built in a week to be shown to TVSH department heads and directors on
> **Wednesday 26 August 2026**, from a Claude Design handoff. It has **no
> gateway, no Business Central, no authentication, no offline behaviour and no
> Cartrack**. Every figure on every screen comes from a seeded file in `lib/`.
>
> The real module is `bc-vantage-transport` plus a gateway package plus a Kotlin
> tablet and phone. The proper design work is
> `vantage-lane/design/TRANSPORT-UI-DESIGN-PROMPTS.md` and it runs **after** the
> 26th. **Nothing in this repo is that.**
>
> The handoff is high fidelity and this will look finished. It is not finished.
> That is the main way a demo like this does damage: it quietly becomes the spec.

---

## What it is

A five-screen desktop console for a transport planner and a fleet manager at
TVSH's Harare depot. It is the desktop third of a three-app module; the store
dispatch tablet (SD-1…3) and the driver phone (DR-1…5) are a **separate mobile
build** and are not in this repo — the demo bar dims their beats.

| Route | Screen | The point |
|---|---|---|
| `/transport/board` | **TM-1** The board | Chaos left, order right. Nine trips in ten cannot show a fill % |
| `/transport/trips/build` | **TM-2** Build a trip | Map, road route, suggestion, and **the refused vehicle** |
| `/transport/live` | **TM-3** Live & exceptions | A stale position with **no ETA**; three exceptions, oldest first |
| `/transport/search` | **TM-4** Search | One number. The closing screen |
| `/transport/fleet/cost` | **TM-5** Fleet cost | What it costs to run; `AFR5403` is the outlier |
| `/transport/notes` | Screen notes | The companion document — what each pane is for |

## Running it

```bash
npm install
npm run build          # static export → out/
npm start              # node serve.mjs → http://localhost:4173/transport/board/
npm run dev            # or the dev server, http://localhost:3000
```

⚠ **`out/index.html` does not work from `file://`.** `output: 'export'` produces
a static site with absolute asset paths (`/_next/…`), so double-clicking the HTML
gives you an unstyled page with no JavaScript. `serve.mjs` is a
zero-dependency Node server written for exactly this: no npx, no network, no
install. Run `npm start` on the demo laptop.

Everything else is offline-safe: **Archivo is vendored** (`app/fonts/`), Leaflet
and its stylesheet come from `node_modules`, and the road routes for every stop
order the scripted demo can reach are **pre-cached** in `lib/routes-cache.ts`.
The only thing that still wants the network is the OpenStreetMap **tile images**.
Without them the map draws its markers and its route line on a blank ground —
legible, but not pretty. Load the demo once on the room's wifi before you start
and the tiles will be in the browser cache.

```bash
npm run routes         # regenerate lib/routes-cache.ts from OSRM (needs network)
NEXT_PUBLIC_DEMO_BAR=off npm run build   # build without the demo running-order bar
```

## The four things that must survive

They are the reason an operator believes the rest of it. If a change kills one
of these, it is the wrong change.

1. **`AHB2107` is refused for an expired certificate of fitness.** The refusal is
   the label on the row — not a tooltip, not a disabled control with a mystery.
   Clicking it reveals the reason and names the grant the planner does not hold.
   **It never assigns.**
2. **A stale position shows no ETA.** Trip 02 reads *"Position unavailable / last
   fix 06:41 — stale, not shown"* and its ETA is `—`. No last-known dot pretends
   to be current.
3. **The branch that has not synced says so.** Marondera, `last synced 14:32`, on
   the sync strip, with *"1 branch behind — its deliveries are not on this
   board"*. Its deliveries are genuinely absent from the board.
4. **A load that cannot be measured says so.** `4 lines with no dimensions` and
   **no bar at all** — never a zero bar, never an empty chart, never a guess.
   Most trips are this form, because a mixed or loose order has no pack sizes
   in the item master. It must read as an ordinary state, not an error.

And one rule that produces them: **never let a straight line pretend to be a
route.** Map legs are dashed until a road answer arrives, and stay dashed if it
never does.

## How it is put together

```
app/
  globals.css              design/styles.css, shipped as-is (line 2 swapped for local fonts)
  fonts.css + fonts/       Archivo, vendored — a network-less laptop must not fall back
  console.css              hovers, scrollbar, Leaflet — what an inline style cannot say
  transport/layout.tsx     header + sync strip + rail + (flagged) demo bar
  transport/*/page.tsx     the five screens, plus notes
components/
  ConsoleState.tsx         the whole client-side store
  Chrome.tsx               header, sync strip, rail, demo bar
  TripCard.tsx  LoadLine.tsx
  TripMap.tsx              Leaflet, ported from design/trip-map.js
  TripMapMount.tsx         the ssr:false boundary
lib/
  data.ts                  every seeded figure, and what is real in each of them
  routing.ts               OSRM + cache + the 1.18 city factor
  optimise.ts              nearest-neighbour
  routes-cache.ts          GENERATED — pre-cached road routes
scripts/build-route-cache.mjs
serve.mjs                  static server for the export
```

**Tokens, never literals.** Every colour, space, radius and shadow comes from a
`styles.css` variable. **Radius is 0 everywhere** — do not round a corner. 2px
rules between regions, 1px between rows; never soften them to hairlines.
Monospace with tabular figures for every figure, identifier, timestamp and money
value. Nothing below 10px.

⚠ **Copy is part of the design.** The teaching lines, the footer notes and the
exception detail text are written to be read aloud in a boardroom. Do not
paraphrase them.

## What is real in the data, and what is not

On this branch: **nothing in the business data is real.** Branch names (codes
kept), vehicle registrations and fleet numbers, consignments, SKUs, the invoice
414414 record and its fiscal signature, driver, crew and customer names, cubic
capacities, compliance dates and every TM-5 figure are illustrative for the Gain
demo. Harare suburbs, the zone letters and the road routes in
`lib/routes-cache.ts` are real geography. When Gain's own data arrives,
`lib/data.ts` and `../GAIN-RESEED.md` are what get replaced.

## Deliberate limits

| Item | Status |
|---|---|
| Evidence thumbnails (TM-4) | **Labelled placeholders.** Real proof comes from the driver app's capture, which is not built. ⚠ Do not fake a photograph of a customer's identity document |
| Route optimisation | Nearest-neighbour — a greedy walk, not an optimiser. Real optimisation moves server-side at phase B11 |
| Routing | OSRM's public demo server, rate-limited, with the scripted orders pre-cached. Production self-hosts or buys one |
| Positions | Illustrative fixes. In production the console reads Cartrack **server-side**, credentials never in the browser, and positions never reach Business Central — only geofence crossings, as timestamps |
| Store dispatch / driver screens | Not in this build |
| `Auto-group by zone`, `Export record` | Present in the design, not wired. They do nothing and are not claimed to |

## Not yet verified

⚠ **It has never been on a projector.** 10px captions, 1px hairlines and the
`#7d7979` on `#f3f2f2` meta line are exactly what dies at the back of a
boardroom. Test on the real projector at the real distance **before the day** —
and if something is illegible, raise it rather than quietly restyling the system.

⚠ The map has only ever been seen **without OSM tiles** (the build environment
cannot reach them). Markers, labels and the road route render correctly; the
tiles themselves are unverified.
