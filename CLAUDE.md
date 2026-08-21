# CLAUDE.md — Vantage Transport Management console

**Repo:** `XPOS/vantage-transport-console/`
**What it is:** the demo build of the transport planner/fleet console, from the Claude Design handoff.
**Deadline:** presentation **Wednesday 26 August 2026**, department heads and directors.
**Last updated:** 21 August 2026 — *B1–B10 built and driven in a browser. B11, the projector pass, is not done. TM-4's evidence rows re-sequenced when the driver app was built (§7), and `next` bumped off a CVSS-10 vulnerability but **not yet installed or re-verified here** (§7a).*

---

## 1. What this is, and what it is not

A **five-screen Next.js console**, static export, all state client-side, no server. It is the
desktop third of a three-app module; the store dispatch tablet and the driver phone are a **separate
mobile build** and are not in this repo.

⚠ **This is a temporary demo build to beat a deadline, and it should stay honest about that.** The
proper design prompts (`vantage-lane/design/TRANSPORT-UI-DESIGN-PROMPTS.md`) run after the 26th. A
demo that quietly becomes the spec is how a product ends up designed at a keyboard — the risk is
real here because this handoff is high-fidelity and will look finished.

**It is not** the real module. No gateway, no Business Central, no offline, no auth, no Cartrack.
Seeded data only. `README.md` opens with that warning so nobody who clones this can miss it.

---

## 2. Where everything is

| What | Where |
|---|---|
| **The handoff** | `TransportManagement/Transport Management Console Demo.zip` → `design_handoff_transport_management/` |
| Handoff instructions | `…/README.md` — **the brief. Read it before touching anything** |
| The prototype | `…/design/Vantage Transport Management.dc.html` — source of truth for layout, copy, behaviour |
| Design system | `…/design/styles.css` (**ships as `app/globals.css`**) + `…/design/readme.md` (the rules) |
| Map component | `…/design/trip-map.js` — ported to `components/TripMap.tsx` |
| Demo notes | `…/design/Demo Notes.dc.html` — now also a screen at `/transport/notes` |
| **Do not port** | `browser-window.jsx`, `doc-page.js` — prototype scaffolding only |
| Architecture | `Transport-Material/TVSH-SDD-TRP-003-Architecture-and-Build-Plan.md` |
| Domain model | `Transport-Material/TVSH-SDD-TRP-001-Domain-Model.md` — **wins over everything on meaning** |
| Screens | `Transport-Material/TVSH-SDD-TRP-002-Three-Applications.md` |
| Seeded day | `Transport-Material/demo/transport-demo-data.json` + `generate_demo_data.py` |
| Index of all of it | `Transport-Material/INDEX.md` |

Sibling Next.js app to copy conventions from: **`XPOS/wa-portal`** (App Router, npm, TypeScript,
`app/` + `lib/`).

---

## 3. The five screens

| Route | Screen | The point |
|---|---|---|
| `/transport/board` | **TM-1 The board** | Chaos left, order right. Nine trips in ten cannot show a fill % |
| `/transport/trips/build` | **TM-2 Build a trip** | Map, OSRM route, suggestion, and **the refused vehicle** |
| `/transport/live` | **TM-3 Live and exceptions** | Stale position with **no ETA**; three exceptions, oldest first |
| `/transport/search` | **TM-4 Search** | One number. **The closing screen** |
| `/transport/fleet/cost` | **TM-5 Fleet cost** | What it costs to run; `AFR5403` is the outlier |
| `/transport/notes` | Screen notes | The companion document, for the rail link and demo-day prep |

Plus app chrome on every screen: header, **branch sync strip** (Marondera behind), 186px left rail,
and the **demo running-order bar** at the foot.

⚠ The demo bar is scaffolding. `NEXT_PUBLIC_DEMO_BAR=off npm run build` drops it.

---

## 4. ⚠⚠ The four things that must survive implementation

The handoff names three; the fourth runs through every screen. **If a shortcut kills one of these,
it is the wrong shortcut** — they are the reason the audience believes the rest.

1. **The vehicle refused for an expired certificate of fitness.** `AFR5403`. The refusal is **the
   label on the row**, not a tooltip, not a disabled control with a mystery. Clicking it reveals the
   reason and the grant you do not hold. It never assigns.
2. **The stale position with no ETA.** Trip 02 reads *"Position unavailable / last fix 06:41 —
   stale, not shown"* and its ETA is `—`. **No last-known dot pretending to be current.**
3. **The branch that has not synced, said out loud.** Marondera, `last synced 14:32`, on the board,
   with "1 branch behind — its deliveries are not on this board".
4. **A load that cannot be measured says so.** `4 lines with no dimensions` and **no bar at all** —
   never a zero bar, never an empty chart, never a guess. It must read as an ordinary state.

`components/LoadLine.tsx` carries the fourth; the other three are in
`app/transport/trips/build/page.tsx`, `lib/data.ts` (`LIVE_TRIPS`) and `components/Chrome.tsx`.

---

## 5. Conventions

**Tokens, never literals.** Every colour, space, radius and shadow from `styles.css` variables.
**Radius is 0 everywhere** — do not round a corner. 2px rules between regions, 1px between rows;
never soften to hairlines or replace with whitespace.

**Type.** Archivo (vendored, `app/fonts/`). **Monospace with `tabular-nums` for every figure,
identifier, timestamp and money value** — the `.mono` class in `app/console.css`. Nothing below 10px.

**Focus** is `2px solid var(--color-accent)`, offset 2px — never the browser default. Non-button
elements that are made interactive carry `.focusable`.

**Fidelity is high.** Colours, type, spacing, copy and interaction states are final. Recreate them
exactly; do not re-derive values. The screens use inline styles reading `var(--…)` tokens, which is
the closest possible transfer of the prototype's own markup — not a re-derivation.

⚠ **Copy is part of the design.** The teaching lines, the footer notes and the exception detail text
are written to be read aloud in a boardroom. Do not paraphrase them.
---

## 6. ✅ Known data problem — resolved 20 August (build step B3)

**The prototype's seed data and the real Fleet Register disagreed**, and a fleet
manager in the room would have recognised his own trucks. `lib/data.ts` has been
through a data-truth pass and every identity now checks out against
`Transport-Material/demo/transport-demo-data.json` and the Fleet Register.

Registrations were right. **Fleet numbers and makes were not:**

| Prototype said | Now reads | |
|---|---|---|
| `AFR5403 · TVS87 · UD Croner` | unchanged | ✅ was already correct |
| `AEF0349 · TVS61 · Isuzu FRR` | `TVS58 · Mitsubishi Fuso` | ✔ fixed |
| `AEK6847 · TVS72 · Hino 500` | dropped from the picker | ✔ real `AEK6847` is TVS62, a Hyundai H100 **flatbed of 6 m³** — not eligible for a 3.5t enclosed load. `AFC1778` (TVS74, Mitsubishi Canter, 16 m³) carries the insurance caution instead |
| `AFG6940 · TVS94 · Isuzu NQR` | `TVS88 · UD MKE · 34.0 m³` | ✔ fixed |
| `AGE5599 · TVS103 · Isuzu NPR` | `TVS103 · UD Kuzer · 22.0 m³` | ✔ make and cube fixed |

⚠ **TVSH runs UD, Mitsubishi, Suzuki and Hyundai. It runs no Isuzu and no Hino.**
The whole picker is now Harare boxed trucks, because the eligibility rule on the
seeded trip is *3.5t curtain-side or larger*.

**Branches.** `BR Bradfield`, `KU Kuwadzana`, `HA Hatfield`, `HI Highfield` and
`CH Chitungwiza` were suburbs used as branch names. The sync strip now reads
**Village Walk · Borrowdale · Mbuya Nehanda · Mega Watt · First Street · Avondale**,
with **Marondera** the one behind — and Marondera is deliberately absent from the
selling branches on the board, because its deliveries genuinely are not on it.

**Zones** are now derived from the suburb using TVSH's real zone table
(Waterfalls is D not A, Chitungwiza F not E, Avondale A not C, Hatfield D not A,
Highfield E not B, Mabvuku C not D). Trip 01 moved from Zone A to Zone C so it
agrees with TM-3, which places it at Msasa on the Mutare Road.

**Two corrected copy lines**, both agreed with Wyne rather than changed at the
keyboard:
- the serial mismatch quotes **`#G-000004652985`** (the seeded day's serial); the
  prototype's `#G-000003318877` belongs to no consignment;
- the rebook owner is **`EC Ecommerce`**, not `EC Chitungwiza` — `EC` is a real
  branch code and Chitungwiza is a suburb. Chitungwiza still appears in the
  detail line above, where it belongs.

**Cubic capacities** now come from the register, so every fraction and its
percentage agree: `TR-…-08` reads `9.40 of 22.0 m³ — 43%` (was `of 18.0 — 52%`)
and the capacity check divides by AGE5599's real 22.0, not 16.0.

⚠ **Every teaching-line number is untouched**: 43 unplanned · 395 min / 11 stops
against 233 min / 9 stops · $1.212 and $1.540 per km · $38,371 and $434,319 YTD ·
6.59 against std 6.64 · 3,179 (+20.5%) · $18.71 · −9.9%.

⚠ Cubic capacities, compliance dates and per-vehicle fuel variance remain
**invented** — TVSH holds none of them. `lib/data.ts` says so at each array.

---

## 7. Build order

| # | Step | Status |
|---|---|---|
| B1 | Scaffold: Next.js App Router, TS, `output: 'export'`, `globals.css` = `styles.css` | ✅ builds and exports; `serve.mjs` serves it with no dependencies |
| B2 | App chrome: header, sync strip, rail, demo bar (flagged) | ✅ on all six routes; `NEXT_PUBLIC_DEMO_BAR=off` drops the bar |
| B3 | `lib/data.ts`, **corrected per §6** | ✅ see §6 |
| B4 | **TM-1 board** — both load-line forms | ✅ unmeasured form has no bar; current trip's card is live |
| B5 | **TM-2 builder** — pool, stops, capacity, picker + **the refusal** | ✅ clicking `AFR5403` does not assign and names the grant |
| B6 | `TripMap` — ported from `trip-map.js`, `ssr:false` | ✅ road route draws; provisional legs dashed |
| B7 | `routing.ts` + `optimise.ts` + **pre-cached routes** | ✅ 47 stop orders cached in `lib/routes-cache.ts`; Reject records the line |
| B8 | **TM-3 live + exceptions** | ✅ trip 02 shows no ETA; all three rows expand |
| B9 | **TM-4 search** | ✅ all four chips resolve to the same record |
| B10 | **TM-5 fleet cost** | ✅ `AFR5403` first, with the closing callout |
| B11 | **Demo pass on the real projector** | ☐ **not done, and it is not optional** |

Extra, not in the original plan: `/transport/notes` — the handoff's Demo Notes as
a real screen, so the rail's "Screen notes ↗" link goes somewhere. Two statements
in it were corrected rather than carried forward (route estimates are road
figures now, not straight-line at 26 km/h).

**Added 20 August, after the driver-app handoff arrived** (agreed with Wyne):
TM-4's record gains a **Payment** row — `USD 1 150.00 cash at the door · receipt
PAY-101-D204-000037`, taken 14:11 offline, in the ledger 18:14 on depot wifi,
deposited at BR Borrowdale. Beat 9 of the running order is the driver taking cash
with no signal; without this row that beat had nowhere to land at beat 13. The
receipt number also resolves in the search box (not as a chip) — ⚠ if someone
reads it off the driver's phone and types it in, it must find the same record.

⚠⚠ **The driver app must agree with this record.** `Vantage Driver` is being
built next and it tells the same story about invoice 414414 from the doorway. Its
handoff dated the run **Thursday 26 August**, which is a Wednesday, and used
vehicle `AFR 8615` and driver `Chiwayo` — Wyne's call on 20 Aug is that **the
driver app moves to this console's record**: Thursday 20 August 2026, trip
`TR-HRE-2026-08-20-05`, `AGE5599 (TVS103)`, `T. Mukanya` with crew `W. Sibindi`.
See `XPOS/DRIVER-APP-kickoff-prompt.md` §1. **Do not change this end to match the
driver app** — these identities are the ones checked against the Fleet Register.

**✅ Built 20 Aug: `XPOS/vantage-driver-app/`.** Nine screens, D1–D10, driven in a
browser with 84 passing assertions; D11 (the projector pass) is not done at
either end. Two things it forced back onto this console, both agreed with Wyne:

1. ⚠ **`EVIDENCE` on TM-4 is re-sequenced** — was `Signature 14:11 · ID 14:12 ·
   Goods 14:14`, which had the receiver signing three minutes *before* the goods
   were photographed. Now `Goods 14:09 · ID 14:10 · Signature 14:11`: three
   pieces of evidence, then the signature, and the line set locks at the
   signature (TRP-004 §3.2 step 6). The driver app's `CAPTURED` holds the same
   three times. **Changing either end means changing both.**
2. ⚠ **The driver app corrects two things this console should know about.** Its
   handoff put the trip in `Zone B · Harare east`; Zone B is *Borrowdale* in
   TVSH's real zone table, so it now reads `Zone C · Greendale / East`, matching
   `SEED_TRIP_ZONE` here. And its debrief offered a deposit at `HL · Highlands`,
   which is a suburb and not a branch — replaced with `AV · Avondale`. Same error
   class as this console's own suburb-as-branch problem in §6.

⚠⚠ **The driver app's route figures are real and this console's assumptions are
not affected** — but be aware that OSRM, asked properly, says the driver-app
handoff's suggested stop order was *slower* than the dispatcher's plan, and that
no reorder of that run can hold its time windows. See
`XPOS/vantage-driver-app/CLAUDE.md` §5. Nothing on TM-2 changes; it is worth
knowing before somebody quotes a saving in the room.

---

## 7a. ⚠⚠ Security — `next` bumped 21 August, and this repo needs `npm install`

Vercel flagged the driver app's `next@15.5.4` as vulnerable. It is **React2Shell** —
`CVE-2025-66478` / upstream `CVE-2025-55182`, **CVSS 10.0 remote code execution** through the React
Server Components protocol, actively exploited. All of Next.js 15.x and 16.x on the App Router are
affected; the fix landed in **15.5.7**.

**This console was on the same `15.5.4`.** `package.json` and `package-lock.json` now name
**`15.5.23`**, the latest in the patched 15.5 line.

⚠⚠ **The install has NOT been run here and this build has NOT been re-verified.** The machine
holding this repo has no npm registry access, so only the two manifest files were changed. Before
the 26th:

```
npm install
npm run build
npm start          # then click through all six screens again
```

⚠ **What the exposure actually was.** This console is `output: 'export'` — the demo is static files
served by `serve.mjs`, with no Next.js runtime behind them, so the demo path was never exploitable.
The real exposure is `npm run dev` on a laptop, which does run a server. Patch it; do not panic
about it.

⚠ Chosen over `next@16.3.1` deliberately: a major version five days before a boardroom demo buys a
different set of unknowns than the one it removes. Two build-time-only advisories (`postcss`
source-map path traversal, `sharp`/libvips) stay open because `npm audit fix --force` resolves them
by installing 16.x. Neither is reachable from a static export. Revisit after the 26th.

⚠ The sibling driver app **is** patched and re-verified — 87 of 87 assertions pass on `15.5.23`,
screens unchanged. See `XPOS/vantage-driver-app/CLAUDE.md` §10a.

---

## 8. Traps

- ⚠ **OSRM's public demo server is rate-limited.** Handled: `npm run routes`
  regenerates `lib/routes-cache.ts`, which holds every stop order the scripted
  demo can reach in one click. Orders a planner invents in the room still route
  live, and draw dashed until the answer lands.
- ⚠ **Never let a straight line pretend to be a route.** Dashed until OSRM
  answers; dashed forever if it does not. `components/TripMap.tsx`.
- ⚠ **Leaflet's stylesheet** is imported in `app/layout.tsx` from `node_modules`,
  and the OSM attribution `© OpenStreetMap contributors` is a **licence
  requirement** — never remove it.
- ⚠ `output: 'export'` means no server components doing data work, no route
  handlers, no `next/image` optimisation, and **no `redirect()`** — `app/page.tsx`
  bounces client-side instead.
- ⚠ **`out/` does not open from `file://`.** Next writes absolute `/_next/…`
  paths. Use `npm start` (`serve.mjs`, zero dependencies, no network).
- ⚠ **Archivo is vendored** in `app/fonts/`. The Google Fonts `@import` on line 2
  of `styles.css` is the one line changed in `globals.css`.
- ⚠ The three TM-4 evidence thumbnails are **labelled placeholders**. Do not fake
  a photograph of a customer's identity document.
- ⚠ **OSM tile images are the one remaining network dependency.** Load the demo
  once on the room's wifi so they are in the browser cache.

---

## 9. Status — 20 August 2026

| | |
|---|---|
| Handoff read | ✅ 19 Aug |
| Repo scaffolded | ✅ 20 Aug |
| Data-truth pass (§6) | ✅ 20 Aug |
| Screens built | ✅ 5 of 5, plus the notes screen |
| Seen in a real browser | ✅ 20 Aug — see below |
| Seen on a projector | ☐ **no** |

**What was actually run**, on 20 August, in a Linux container:

- `npm install`, `npm run build` — compiles clean, exports 8 static routes.
- `node scripts/build-route-cache.mjs` — 47 of 47 stop orders fetched from OSRM.
- `node serve.mjs`, then headless Chromium (Playwright) against every route:
  all five screens screenshotted; **zero page errors, zero console errors** other
  than blocked OSM tile requests.
- Interactions driven and asserted: clicking `AFR5403` shows the refusal panel and
  leaves the header at *none assigned*; assigning `AGE5599` changes the release
  button to *Release trip · AGE5599*; *Preview suggested route* produces
  `58 km · 100 min driving · back 13:44 (saves 14 min)` and redraws the map with
  the caption *Suggested order*; *Reject* leaves the recorded-rejection line;
  removing a stop recomputes service 319 → 277 min; *Clear stops* shows the empty
  state; all four search chips resolve to invoice 414414; all three exception rows
  expand; *Next beat* walks 1 → 13 and lands on board, board, build, (seven mobile
  beats that correctly do not navigate), live, cost, search.
- The seeded trip's estimate reads
  `73 km by road · 114 min driving · 319 min service · back at depot 13:58` — the
  same figures the handoff quotes.

**What has NOT been verified:**

- ⚠⚠ **A projector, at the back of a room.** This is B11 and it is the one that
  will actually bite. 10px captions and 1px rules are exactly what fails there.
- ⚠ **OSM tiles.** The build environment cannot reach `tile.openstreetmap.org`,
  so the maps have only ever been seen on a blank ground. Markers, labels and the
  road route are correct; the tiles themselves are untested.
- ⚠ **Windows.** Built and run on Linux only. Fonts, `serve.mjs` and the export
  should be identical, but that is a reasonable expectation, not a fact.
- ⚠ **A real Chrome, at 1600 × 1000, by a person.** Headless Chromium is not the
  same fact as someone clicking through it.

*"It builds" is not "it works", and neither of them is "it was legible from the
back".*

---

## 10. Rules inherited from the estate

From `XPOS/CLAUDE.md` §8, and they apply here even though this is a demo:

- **Say what is not built, on its face.** A screen that reports work it did not
  do is the worst defect class in this codebase; it has happened three times.
- **Never quote a figure you cannot stand behind.** The whole load-line design is
  this rule.
- **Comment the reasoning, not the mechanics.** ⚠ marks a load-bearing decision;
  ⚠⚠ marks one that will hurt somebody.
- **Verify against the real thing, and say plainly what you have not verified.**
