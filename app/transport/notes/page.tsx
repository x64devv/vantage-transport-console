'use client';

/* Screen notes — the companion document from the handoff (design/Demo Notes.dc.html),
 * as a real route so the rail's link goes somewhere.
 *
 * ⚠ Two statements from the original are corrected here rather than carried
 * forward, because they are no longer true of this build: route estimates are
 * now real road figures from OSRM with a 1.18 city allowance (not straight-line
 * at 26 km/h), and the vehicle identities are the Fleet Register's. Everything
 * else is the handoff's own words.
 */

import Link from 'next/link';
import { N6, N7 } from '@/lib/data';

const H: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, margin: '26px 0 8px' };
const P: React.CSSProperties = { fontSize: 12.5, lineHeight: 1.65, margin: '0 0 10px', maxWidth: 760 };
const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: N6 };

function Pane({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '170px 1fr', gap: 16, padding: '8px 0',
        borderBottom: '1px solid var(--color-neutral-300)', maxWidth: 900,
      }}
    >
      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: 11.5, lineHeight: 1.6, color: N7 }}>{children}</div>
    </div>
  );
}

export default function Notes() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '18px 26px 40px' }}>
      <h3 style={{ margin: 0 }}>Vantage Transport Management · demo notes</h3>
      <div style={{ fontSize: 11.5, color: N7, marginTop: 4 }}>
        What each screen does, and what each pane is for. Harare depot, Thursday 20 August 2026 · prepared for the
        TVSH demo, 26 August 2026.
      </div>

      <h4 style={H}>How to run it</h4>
      <p style={P}>
        The console opens on the board. The left rail moves between the five screens; the black bar at the foot of the
        window is the demo running order — <strong>Next beat</strong> walks the thirteen spoken lines and jumps to the
        screen each one belongs to. Beats 4 to 10 are dimmed: those are the store-dispatch and driver screens, a
        separate mobile build.
      </p>
      <p style={P}>
        Three moments are failures on purpose — a refused vehicle, a stale position with no ETA, and a branch that has
        not synced. They are the point, not defects. An operation this size does not believe a demo where everything
        works.
      </p>

      <h4 style={H}>TM-1 · The board</h4>
      <p style={P}>
        Answers one question in three seconds: what is promised today, and how much of it is on a truck. Chaos on the
        left, order on the right.
      </p>
      <Pane name="Branch sync strip">
        One stamp per selling branch. Marondera reads <span className="mono">last synced 14:32</span> — its deliveries
        are not on this board. A board that silently omits an offline branch is lying by omission, so the omission is
        stated.
      </Pane>
      <Pane name="Unplanned">
        Consignments promised today with no trip. Branch, suburb, zone, goods and measured service time. Clicking one
        takes you into the trip builder.
      </Pane>
      <Pane name="Building">
        Trips being planned. The trip you are editing is marked in red and its figures are live. Nothing here has
        departed.
      </Pane>
      <Pane name="Running">
        Trips on the road plus hired carriers. The carrier trip reads <em>awaiting proof</em>, not “stuck” — a third
        party legitimately reports nothing between depot and door.
      </Pane>
      <Pane name="Load line">
        Either a real percentage or a plain count of unmeasured lines. Both are normal states. Nine trips in ten cannot
        show a fill percentage, because TVSH has no dimension data for furniture. The honest form (
        <span className="mono">5 lines with no dimensions</span>, no bar) sits beside the working form (
        <span className="mono">7.07 of 22.0 m³ — 32%</span>). The honest one must not look like an error; today it is
        the normal case.
      </Pane>
      <p style={{ ...P, marginTop: 10 }}>
        The service-time column is the other quiet point: 395 minutes across 11 stops against 233 across 9. Nearly the
        same stop count, almost three hours apart, because one trip is beds and the other is appliances.
      </p>

      <h4 style={H}>TM-2 · Build a trip</h4>
      <p style={P}>
        Where a planner turns a pile of promises into a route on a truck. Everything on this screen recomputes from what
        is on the trip.
      </p>
      <Pane name="Unplanned pool">
        <span className="mono">Add +</span> puts a consignment on the trip; the <span className="mono">×</span> in the
        stops table takes it off and returns it to the pool. Adding holds the slot, removing releases it — both
        idempotent on the till’s transaction number, so a repeat never double-books.
      </Pane>
      <Pane name="Map">
        Real OpenStreetMap streets with the depot, the numbered stops in trip order and the route line. The caption says
        whose order is drawn — the planner’s, or the suggestion. A leg drawn <strong>dashed</strong> is a straight line,
        not a road route: it means the router has not answered yet, or cannot be reached.
      </Pane>
      <Pane name="Estimate bar">
        Distance, driving minutes, measured service minutes and the time the truck is back at the depot, from a 06:45
        departure. Distance and driving time are road figures from OSRM with an 18% city allowance; until the answer
        lands the line says <span className="mono">(routing…)</span>.
      </Pane>
      <Pane name="Suggested route">
        <em>Preview suggested route</em> proposes a stop order and states the saving in minutes. <em>Accept order</em>{' '}
        renumbers the trip and redraws the map; <em>Reject</em> keeps the planner’s order and records the rejection with
        a reason — the optimiser is advice, and a rejected suggestion stays queryable.
      </Pane>
      <Pane name="Stops table">The trip itself, in sequence, with each stop’s own service time.</Pane>
      <Pane name="Capacity check">
        Either a percentage or the count of unmeasured lines, plus truck-type eligibility and crew requirement. It
        refuses to invent a number.
      </Pane>
      <Pane name="Vehicle picker">
        The list a planner chooses from — and the point of the screen.{' '}
        <strong>The refusal is the label, not a tooltip.</strong>{' '}
        <span className="mono">AFR5403 — TVS87 · UD Croner · 28.0 m³ · Certificate of Fitness expired 12 August</span>{' '}
        reads its reason before anyone clicks. Two more are flagged in caution rather than alert: COF expiring 31
        August, insurance expiring 26 August — available, but visibly close. Overriding a compliance block needs a
        separate grant. A truck dispatched without valid papers is a truck impounded with a customer’s goods on it.
      </Pane>

      <h4 style={H}>TM-3 · Live and exceptions</h4>
      <Pane name="Live trips">
        Vehicle, driver, stops completed, position and an honest ETA. Every timestamp names its source —{' '}
        <span className="mono">departed 07:06 · by geofence</span>, not “departed”. Trip 02’s fix is stale, so the
        position is absent and says so; no last-known dot pretends to be current, and no ETA is offered without a fix.
      </Pane>
      <Pane name="Map">
        Vehicles with live fixes and today’s unplanned demand as pins, so a planner can see where the work is against
        where the trucks are.
      </Pane>
      <Pane name="Exceptions">
        Everything that went wrong today, oldest first. Click a row for the detail and what happens next. The{' '}
        <em>fault</em> column is a billing field, so it is styled as a fact rather than an accusation: TVSH, customer,
        or blank. The third row — six deliveries signed with the photographs still queued for depot wifi — is not a
        failure. Proof arriving later is a visible state rather than a silent one; outcomes, signatures and cash go out
        immediately, images wait for wifi.
      </Pane>

      <h4 style={H}>TM-4 · Search</h4>
      <p style={P}>
        The closing screen, and the only one showing something TVSH cannot do at all today. One field takes an invoice
        number, a serial, a vehicle registration or a customer name and returns everything that number touches, as one
        chronological story: invoice and fiscal identity, branch, customer, address with a driver-confirmed pin, goods
        with serials, the scan out, the trip and vehicle, driver and crew, geofenced departure and arrival, the outcome
        and functional test, who signed and their ID number, the three pieces of evidence as thumbnails, the charge, and
        what was posted.
      </p>
      <p style={P}>
        Today the invoice, the Issue Distribution Order, the Confirmation Note and the Driver Allocation Book each carry
        their own number and share no key — a person in an office reconciles them by hand. Read this screen out loud;
        that is the whole argument.
      </p>

      <h4 style={H}>TM-5 · Fleet cost</h4>
      <p style={P}>
        The director’s screen, from TVSH’s own April 2026 figures: 60 active vehicles, 117,169 km, $1.212 per km
        excluding third parties and $1.540 including them, fuel and maintenance broken out per km and in dollars,
        third-party spend for the month against year to date, fuel efficiency against standard, deliveries and revenue
        per delivery. Right-hand pane is per-vehicle fuel variance against target, which exists to find one row:
        AFR5403, 9.9% worse than target — the same truck the compliance block refused on TM-2.
      </p>

      <h4 style={H}>Deliberate limits of this demo</h4>
      <div style={{ maxWidth: 900 }}>
        <div style={{ ...LABEL, padding: '6px 0' }}>Item · status</div>
        <Pane name="Evidence thumbnails">
          Labelled placeholders — real signature, ID and goods photographs come from the driver app’s proof capture,
          which is not built.
        </Pane>
        <Pane name="Route optimisation">
          Nearest-neighbour, scored against real road figures. It is a greedy walk, not an optimiser; real optimisation
          moves server-side at phase B11.
        </Pane>
        <Pane name="Routing">
          OSRM’s public demo server, with the scripted stop orders pre-cached so the demo never waits on it. Production
          self-hosts a router or buys one.
        </Pane>
        <Pane name="Positions">
          Illustrative fixes. In production the console reads Cartrack directly, server-side; positions never reach
          Business Central — only geofence crossings, as arrival and departure timestamps.
        </Pane>
        <Pane name="Store dispatch (SD) and driver (DR) screens">
          Not in this build. They are the mobile surfaces and carry the offline burden.
        </Pane>
        <Pane name="Data">
          Representative Harare consignments. Branches, zones, vehicle registrations, fleet numbers and makes are
          TVSH’s own; driver and customer names, vehicle cubic capacities and compliance dates are invented, because
          TVSH holds no capacity or expiry data and attaching a real employee to a fictional serial mismatch in front of
          directors is a bad idea. Fleet cost figures are April 2026 actuals as supplied.
        </Pane>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/transport/board" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          Back to the board
        </Link>
      </div>
    </div>
  );
}
