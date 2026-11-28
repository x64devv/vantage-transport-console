'use client';

/* TM-1 — The board.
 * In three seconds: what is promised today, and how much of it is on a truck.
 * Chaos left, order right. */

import { useRouter } from 'next/navigation';
import {
  AC, BOARD_FOOTER_FIGURES, BOARD_FOOTER_PROSE, BUILDING_STATIC, N6, RUNNING,
  SEED_TRIP_ID, SEED_TRIP_TRANSFER, SEED_VEHICLE, UNPLANNED, UNPLANNED_MORE, UNPLANNED_TOTAL, zoneOf,
} from '@/lib/data';
import { useConsole } from '@/components/ConsoleState';
import { TripCardView } from '@/components/TripCard';

function ColumnHeader({ name, count, countColor, note }: { name: string; count: string; countColor?: string; note: string }) {
  return (
    <div
      style={{
        padding: '9px 14px', display: 'flex', alignItems: 'baseline', gap: 8,
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
        {name}
      </div>
      <div className="mono" style={{ fontSize: 20, lineHeight: 1, color: countColor }}>{count}</div>
      <div style={{ fontSize: 10.5, color: N6, marginLeft: 'auto' }}>{note}</div>
    </div>
  );
}

export default function Board() {
  const router = useRouter();
  const { stops, tripId, tripZone, assigned, newTrip } = useConsole();

  /* The card for the trip currently open in the builder carries live figures, so
     the board and the builder can never disagree about the same trip. */
  const dimless = stops.filter((s) => !s.dims).length;
  const cube = stops.filter((s) => s.dims).reduce((a, s) => a + (s.m3 || 0), 0);
  const cap = SEED_VEHICLE.cubeM3;
  const pct = dimless ? null : Math.round((cube / cap) * 100);
  const current = {
    id: tripId,
    zone: tripZone,
    vehicle: assigned ? `${assigned} assigned` : `${SEED_VEHICLE.reg} · ${SEED_VEHICLE.fleetNo}`,
    stops: stops.length,
    service: stops.reduce((a, s) => a + s.service, 0),
    status: 'Building now',
    capText: dimless
      ? `${dimless} lines with no dimensions`
      : `${cube.toFixed(2)} of ${cap.toFixed(1)} m³ — ${pct}%`,
    capPct: pct,
    statusColor: AC,
    edge: AC,
    /* ⚠ Only the seeded trip carries IDO-…-0007. A new trip built in the room
       has no transfer on it, and its card must not borrow one. */
    transfer: tripId === SEED_TRIP_ID ? SEED_TRIP_TRANSFER : undefined,
  };

  const building = [BUILDING_STATIC[0], current, ...BUILDING_STATIC.slice(1)];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '14px 18px 10px' }}>
        <h3 style={{ margin: 0 }}>The board</h3>
        <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', paddingBottom: 3 }}>
          Promised today. Left is what is not on a truck yet.
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {/* ⚠ In the design, not wired. Dimmed and labelled so it is never a dead control. */}
          <button
            className="btn btn-secondary" type="button" disabled
            title="Not wired in this demo" style={{ opacity: 0.45, cursor: 'not-allowed' }}
          >
            Auto-group by zone · not in this demo
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => { newTrip(); router.push('/transport/trips/build'); }}
          >
            New trip
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px 1fr 1fr',
          borderTop: '2px solid var(--color-divider)',
        }}
      >
        {/* ── Unplanned ─────────────────────────────────────────────────── */}
        <div style={{ borderRight: '2px solid var(--color-divider)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ColumnHeader name="Unplanned" count={String(UNPLANNED_TOTAL)} countColor={AC} note="consignments" />
          <div style={{ flex: 1, overflow: 'auto' }}>
            {UNPLANNED.map((c) => (
              <div
                key={c.inv}
                role="link"
                tabIndex={0}
                className="row-hover focusable"
                onClick={() => router.push('/transport/trips/build')}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push('/transport/trips/build'); }}
                style={{ cursor: 'pointer', padding: '9px 14px', borderBottom: '1px solid var(--color-neutral-300)' }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{c.inv}</span>
                  <span className="tag tag-neutral" style={{ marginLeft: 'auto', fontSize: 10 }}>
                    Zone {zoneOf(c.suburb)}
                  </span>
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{c.customer}</div>
                <div style={{ fontSize: 11, color: 'var(--color-neutral-700)' }}>{c.suburb} · {c.goods}</div>
                <div className="mono" style={{ fontSize: 10.5, color: N6, marginTop: 3 }}>
                  {c.branch} · {c.service} min service
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 14px', fontSize: 11, color: N6 }}>{UNPLANNED_MORE}</div>
          </div>
        </div>

        {/* ── Building ──────────────────────────────────────────────────── */}
        <div style={{ borderRight: '2px solid var(--color-divider)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ColumnHeader name="Building" count={String(building.length)} note="trips · nothing departed" />
          <div style={{ flex: 1, overflow: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {building.map((t) => (
              <TripCardView key={t.id} t={t} href="/transport/trips/build" />
            ))}
          </div>
        </div>

        {/* ── Running ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ColumnHeader name="Running" count="3" note="+ 1 hired carrier" />
          <div style={{ flex: 1, overflow: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RUNNING.map((t) => (
              <TripCardView key={t.id} t={t} href="/transport/live" />
            ))}
          </div>
        </div>
      </div>

      {/* ⚠ Both lines verbatim from the handoff. They are written to be read
          aloud, and the figures in the second are real. */}
      <div
        style={{
          flex: 'none', borderTop: '2px solid var(--color-divider)', padding: '9px 18px',
          display: 'flex', gap: 26, alignItems: 'center', background: 'var(--color-surface)',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--color-neutral-700)', maxWidth: 520 }}>{BOARD_FOOTER_PROSE}</div>
        <div className="mono" style={{ fontSize: 11 }}>{BOARD_FOOTER_FIGURES}</div>
      </div>
    </div>
  );
}
