'use client';

/* Reports — URD 10.12.3, and what this demo actually has behind each one.
 *
 * ⚠⚠ Phase 2 (2.5), Gain re-seed. This screen exists to ANSWER the RFP's report
 * list honestly, not to look like a reporting module. No report output is drawn
 * here: a table of figures nobody produced is the worst defect class in this
 * codebase. Each row says which screen covers it today, how far, and what is
 * not built — and "not built" is said in those words.
 */

import Link from 'next/link';
import { N6, N7 } from '@/lib/data';

type State = 'Screen exists' | 'Partly' | 'Not built in this demo';

type Row = {
  name: string;
  state: State;
  covers: string;
  links: { href: string; label: string }[];
  missing: string;
};

const REPORTS: Row[] = [
  {
    name: 'Dispatch Reports',
    state: 'Partly',
    covers: 'The board shows what is promised and what is on a truck; the dispatch tablet holds the load sheet, seals and gate pass.',
    links: [{ href: '/transport/board', label: 'TM-1 The board' }],
    missing: 'No dated, filterable dispatch report and no export.',
  },
  {
    name: 'Delivery Status Reports',
    state: 'Partly',
    covers: 'Live trips with stop progress and honest ETAs; any one invoice traced end to end.',
    links: [
      { href: '/transport/live', label: 'TM-3 Live' },
      { href: '/transport/search', label: 'TM-4 Search' },
    ],
    missing: 'No report across a day, branch or customer.',
  },
  {
    name: 'Proof of Delivery Exception Reports',
    state: 'Partly',
    covers: 'Open exceptions, oldest first, each with fault, owner and the evidence state.',
    links: [{ href: '/transport/live', label: 'TM-3 Exceptions' }],
    missing: 'Today’s list only; no history, ageing or totals by fault.',
  },
  {
    name: 'Trip P&L Reports',
    state: 'Partly',
    covers: 'One trip worked through on the fleet cost screen, with every input named.',
    links: [{ href: '/transport/fleet/cost', label: 'TM-5 Trip P&L' }],
    missing: 'One seeded trip, illustrative inputs. No report over all trips.',
  },
  {
    name: 'Route Efficiency Reports',
    state: 'Partly',
    covers: 'The builder compares the planned order with the suggested road route for the trip in hand.',
    links: [{ href: '/transport/trips/build', label: 'TM-2 Build a trip' }],
    missing: 'Per trip, while planning. No planned-against-driven report.',
  },
  {
    name: 'Logistics Cost Reports',
    state: 'Screen exists',
    covers: 'Cost per km, fuel, repairs, third-party carriers and fuel variance by vehicle.',
    links: [{ href: '/transport/fleet/cost', label: 'TM-5 Fleet cost' }],
    missing: 'One month, illustrative figures, no export.',
  },
];

const BY: Row[] = [
  {
    name: 'By route',
    state: 'Partly',
    covers: 'Zones and road routes per trip.',
    links: [{ href: '/transport/trips/build', label: 'TM-2' }],
    missing: 'No totals by route.',
  },
  {
    name: 'By vehicle',
    state: 'Partly',
    covers: 'Fuel variance per registration; refusals on compliance.',
    links: [{ href: '/transport/fleet/cost', label: 'TM-5' }],
    missing: 'No cost or utilisation per vehicle.',
  },
  {
    name: 'By transporter',
    state: 'Not built in this demo',
    covers: 'Third-party carrier spend appears as one cost line; the hired trip is on the board.',
    links: [{ href: '/transport/fleet/cost', label: 'TM-5 cost line' }],
    missing: 'No per-carrier performance or cost report.',
  },
  {
    name: 'By load',
    state: 'Partly',
    covers: 'Any load reached through one of its invoices; the dispatch tablet holds the load sheet.',
    links: [{ href: '/transport/search', label: 'TM-4' }],
    missing: 'No load list or load report in the console.',
  },
];

function Table({ title, rows, testid }: { title: string; rows: Row[]; testid: string }) {
  return (
    <div data-testid={testid} style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: N6, marginBottom: 6 }}>
        {title}
      </div>
      <div
        style={{
          display: 'grid', gridTemplateColumns: '260px 150px 1fr 1fr 210px', gap: 14,
          padding: '6px 0', borderBottom: '2px solid var(--color-divider)', fontSize: 10.5, color: N6,
          textTransform: 'uppercase', letterSpacing: '.08em',
        }}
      >
        <div>Report</div><div>State</div><div>What covers it today</div><div>Not built</div><div>Go to</div>
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          data-testid={`report-${r.name}`}
          style={{
            display: 'grid', gridTemplateColumns: '260px 150px 1fr 1fr 210px', gap: 14,
            padding: '10px 0', borderBottom: '1px solid var(--color-neutral-300)', alignItems: 'baseline',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
          <div>
            <span
              className={`tag ${r.state === 'Screen exists' ? 'tag-neutral' : r.state === 'Partly' ? 'tag-outline' : 'tag-accent'}`}
              style={{ fontSize: 10 }}
            >
              {r.state}
            </span>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.45 }}>{r.covers}</div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: N7 }}>{r.missing}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {r.links.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="focusable" style={{ fontSize: 12 }}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '14px 18px 10px' }}>
        <h3 style={{ margin: 0 }}>Reports</h3>
        <div style={{ fontSize: 11.5, color: N7, paddingBottom: 3 }}>
          URD 10.12.3, and what this demo has behind each one. No report output is drawn here.
        </div>
        {/* ⚠ Not wired. Dimmed and labelled, never a dead control. */}
        <button
          className="btn btn-secondary" type="button" disabled
          style={{ marginLeft: 'auto', opacity: 0.45, cursor: 'not-allowed' }}
        >
          Export · not in this demo
        </button>
      </div>
      <div style={{ borderTop: '2px solid var(--color-divider)', padding: '14px 18px' }}>
        <Table title="The six logistics reports Gain lists" rows={REPORTS} testid="reports-urd" />
        <Table title="Reporting by route, vehicle, transporter and load (URD 10.12.2)" rows={BY} testid="reports-by" />
        <div style={{ fontSize: 11.5, color: N7, maxWidth: 760, lineHeight: 1.5 }}>
          In the product these are Business Central reports over the transport records the three apps write
          — trips, loads, serial binds, proof of delivery and exceptions. None of that posting exists in this
          demo, so this page names the screens instead of drawing tables nobody produced.
        </div>
      </div>
    </div>
  );
}
