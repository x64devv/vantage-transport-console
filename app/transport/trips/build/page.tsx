'use client';

/* TM-2 — Build a trip.
 * Turn promises into a routed trip on a compliant truck. Every figure on this
 * screen recomputes from what is on the trip; nothing is a static label. */

import { useRouter } from 'next/navigation';
import {
  AC, CAUTION_EDGE, CAUTION_TEXT, DEPOT, N6, N7, REFUSAL, SEED_VEHICLE, TX,
  VEHICLES, co,
} from '@/lib/data';
import { estimate } from '@/lib/routing';
import { useConsole } from '@/components/ConsoleState';
import TripMapMount from '@/components/TripMapMount';

const LABEL: React.CSSProperties = {
  fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: N6,
};

export default function BuildTrip() {
  const router = useRouter();
  const {
    tripId, tripZone, stops, pool, assigned, refused, suggestion, rejected, road,
    addStop, removeStop, clearStops, newTrip, previewRoute, acceptRoute, rejectRoute,
    assign, showRefusal,
  } = useConsole();

  const est = estimate(stops, road(stops));
  const sug = suggestion ? estimate(suggestion, road(suggestion)) : null;

  const dimless = stops.filter((s) => !s.dims).length;
  const cube = stops.filter((s) => s.dims).reduce((a, s) => a + (s.m3 || 0), 0);
  const capacityVehicle = VEHICLES.find((v) => v.reg === assigned) ?? SEED_VEHICLE;
  const cap = capacityVehicle.cubeM3;

  /* ⚠⚠ The capacity check obeys the same rule as the board's load line: if a
     single line on the trip has no dimensions, no percentage exists and none is
     shown. The fraction and the percentage are formatted together so they can
     never drift apart. */
  const capacityLine = dimless
    ? `${dimless} lines with no dimensions`
    : `${cube.toFixed(2)} of ${cap.toFixed(1)} m³ — ${Math.round((cube / cap) * 100)}%`;
  const capacityNote = dimless
    ? 'No percentage can be computed. Beds and lounge suites are unmeasured. Truck-type eligibility: 3.5t curtain-side or larger.'
    : 'Every line on this trip is measured, so a real fill percentage is shown. Truck-type eligibility: 3.5t curtain-side or larger.';

  const shown = suggestion || stops;
  const mapStops = shown.map((s, i) => ({
    n: i + 1,
    label: `${s.suburb} · ${s.inv}`,
    lat: co(s.suburb)[0],
    lng: co(s.suburb)[1],
  }));

  const estimateLine = stops.length
    ? `${est.km} km by road · ${est.drive} min driving · ${est.service} min service · back at depot ${est.back}` +
      (est.isRoad ? '' : '   (routing…)')
    : 'no stops yet — add from the pool';

  const saving = sug ? est.total - sug.total : 0;
  const suggestionLine = sug
    ? `${sug.km} km · ${sug.drive} min driving · back ${sug.back}  (${saving > 0 ? `saves ${saving} min` : 'no saving'})`
    : '';

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, padding: '14px 18px 10px' }}>
        <h3 style={{ margin: 0 }}>
          Build trip <span className="mono" style={{ fontSize: 16, fontWeight: 400 }}>{tripId}</span>
        </h3>
        <div style={{ fontSize: 11.5, color: N7, paddingBottom: 3 }}>
          {tripZone} · nominated day Thursday · {stops.length} stops
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" type="button" onClick={newTrip}>New trip</button>
          <button className="btn btn-secondary" type="button" onClick={() => router.push('/transport/board')}>
            Back to board
          </button>
          <button className="btn btn-primary" type="button" onClick={() => router.push('/transport/live')}>
            {assigned ? `Release trip · ${assigned}` : 'Release trip'}
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '264px 1fr 330px',
          borderTop: '2px solid var(--color-divider)',
        }}
      >
        {/* ── Left: the unplanned pool ──────────────────────────────────── */}
        <div style={{ borderRight: '2px solid var(--color-divider)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-divider)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={LABEL}>Unplanned pool</span>
            <span className="mono" style={{ fontSize: 11, marginLeft: 'auto', color: N6 }}>{pool.length} left</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {pool.map((c) => (
              <div
                key={c.inv}
                className="row-hover"
                style={{
                  padding: '8px 12px', borderBottom: '1px solid var(--color-neutral-300)',
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{c.inv}</div>
                  <div style={{ fontSize: 11.5 }}>{c.customer}</div>
                  <div style={{ fontSize: 10.5, color: N7 }}>{c.suburb} · {c.goods}</div>
                  <div className="mono" style={{ fontSize: 10, color: N6 }}>{c.service} min service</div>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: '3px 7px' }}
                  type="button"
                  onClick={() => addStop(c)}
                >
                  Add +
                </button>
              </div>
            ))}
            <div style={{ padding: '9px 12px', fontSize: 10.5, color: N6 }}>
              Adding a consignment holds its slot; removing releases it. Both are idempotent on the till’s transaction number.
            </div>
          </div>
        </div>

        {/* ── Centre: map, estimate, suggestion, stops ──────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '2px solid var(--color-divider)' }}>
          <div style={{ flex: 'none', height: 300, borderBottom: '1px solid var(--color-divider)', position: 'relative' }}>
            <TripMapMount
              center={[-17.84, 31.06]}
              zoom={11}
              depot={DEPOT}
              stops={mapStops}
              routeKeySuburbs={shown.map((s) => s.suburb)}
              line
            />
            <div
              style={{
                position: 'absolute', left: 10, bottom: 12, zIndex: 500,
                background: 'var(--color-bg)', padding: '5px 9px', fontSize: 10,
                letterSpacing: '.08em', textTransform: 'uppercase', boxShadow: 'var(--shadow-sm)',
              }}
            >
              {suggestion ? 'Suggested order · OpenStreetMap' : 'Planner order · OpenStreetMap'}
            </div>
          </div>

          <div
            style={{
              flex: 'none', padding: '9px 12px', borderBottom: '1px solid var(--color-divider)',
              display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)',
            }}
          >
            <div>
              <div style={LABEL}>Estimate · depart 06:45</div>
              <div className="mono" style={{ fontSize: 12.5, marginTop: 2 }}>{estimateLine}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" type="button" onClick={clearStops}>Clear stops</button>
              <button className="btn btn-primary" type="button" onClick={previewRoute}>Preview suggested route</button>
            </div>
          </div>

          {suggestion ? (
            <div
              style={{
                flex: 'none', borderBottom: '2px solid var(--color-accent)',
                background: 'var(--color-accent-100)', padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, color: 'var(--color-accent-800)' }}>
                  Suggested route
                </div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--color-accent-800)' }}>{suggestionLine}</div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ borderColor: 'var(--color-accent-700)', color: 'var(--color-accent-800)' }}
                    type="button"
                    onClick={rejectRoute}
                  >
                    Reject
                  </button>
                  <button className="btn btn-primary" type="button" onClick={acceptRoute}>Accept order</button>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--color-accent-800)', marginTop: 5 }}>
                {suggestion.map((s, i) => `${i + 1} ${s.suburb}`).join('  →  ')}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--color-accent-700)', marginTop: 4 }}>
                Distance and driving time are road figures from the routing engine, plus measured service time and a 18% allowance for city traffic. A rejection is recorded and queryable — the optimiser is advice, not an instruction.
              </div>
            </div>
          ) : null}

          {/* ⚠ A rejection leaves a line. The optimiser is advice; the record of
              having declined it is part of why a planner will trust it. */}
          {rejected ? (
            <div style={{ flex: 'none', borderBottom: '1px solid var(--color-divider)', padding: '7px 12px', fontSize: 11, color: N7 }}>
              Suggestion rejected at 07:19 by A. Marimo — reason recorded as{' '}
              <span className="mono">planner preference</span>. Kept the planner’s order.
            </div>
          ) : null}

          <div
            style={{
              flex: 'none', padding: '8px 12px', borderBottom: '1px solid var(--color-divider)',
              display: 'flex', alignItems: 'baseline', gap: 10,
            }}
          >
            <span style={LABEL}>Stops on this trip</span>
            <span className="mono" style={{ fontSize: 12 }}>{stops.length}</span>
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: N7 }}>
              {est.service} min service · 2 crew required
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {stops.length === 0 ? (
              <div style={{ padding: '26px 14px', fontSize: 12, color: N7, maxWidth: 430 }}>
                This trip is empty. Add consignments from the pool on the left — the map, the estimate and the capacity check all follow what is on the trip.
              </div>
            ) : (
              <table className="table" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th>Consignment</th>
                    <th>Customer</th>
                    <th>Suburb</th>
                    <th>Goods</th>
                    <th style={{ textAlign: 'right', width: 64 }}>Service</th>
                    <th style={{ width: 34 }} />
                  </tr>
                </thead>
                <tbody>
                  {stops.map((s, i) => (
                    <tr key={s.inv}>
                      <td className="mono">{i + 1}</td>
                      <td className="mono" style={{ fontSize: 11.5 }}>{s.inv}</td>
                      <td>{s.customer}</td>
                      <td style={{ color: N7 }}>{s.suburb}</td>
                      <td style={{ color: N7 }}>{s.goods}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{s.service}</td>
                      <td>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '0 5px', fontSize: 13 }}
                          title="Remove from trip"
                          type="button"
                          onClick={() => removeStop(s.inv)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Right: vehicle and capacity ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-divider)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={LABEL}>Vehicle</span>
            <span
              className="mono"
              style={{ fontSize: 11.5, marginLeft: 'auto', color: assigned ? TX : 'var(--color-accent-700)' }}
            >
              {assigned ? `${assigned} assigned` : 'none assigned'}
            </span>
          </div>

          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-divider)', background: 'var(--color-surface)' }}>
            <div style={{ ...LABEL, marginBottom: 6 }}>Capacity check</div>
            <div className="mono" style={{ fontSize: 13 }}>{capacityLine}</div>
            <div style={{ fontSize: 10.5, color: N7, marginTop: 3 }}>{capacityNote}</div>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {VEHICLES.map((v) => {
              const isAssigned = assigned === v.reg;
              const edge =
                v.state === 'refused' ? AC
                  : v.state === 'caution' ? CAUTION_EDGE
                    : isAssigned ? TX : 'transparent';
              const bg =
                v.state === 'refused' ? 'var(--color-accent-100)'
                  : isAssigned ? 'var(--color-surface)' : 'transparent';
              const noteColor =
                v.state === 'refused' ? 'var(--color-accent-700)'
                  : v.state === 'caution' ? CAUTION_TEXT : N7;
              return (
                <div
                  key={v.reg}
                  role="button"
                  tabIndex={0}
                  className="veh-row focusable"
                  /* ⚠⚠ The refused vehicle never assigns. Not a disabled control
                     with a mystery, not a tooltip — the row carries its own
                     refusal as a label, and clicking it says what would be
                     needed to override and who holds that grant. */
                  onClick={() => (v.state === 'refused' ? showRefusal() : assign(v.reg))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      v.state === 'refused' ? showRefusal() : assign(v.reg);
                    }
                  }}
                  style={{
                    cursor: 'pointer', padding: '9px 12px',
                    borderBottom: '1px solid var(--color-neutral-300)',
                    borderLeft: `3px solid ${edge}`, background: bg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{v.reg}</span>
                    <span className="mono" style={{ fontSize: 10.5, color: N6 }}>{v.fleetNo} · {v.make}</span>
                    <span className="mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: N7 }}>
                      {v.cubeM3.toFixed(1)} m³
                    </span>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 2, color: noteColor }}>{v.note}</div>
                </div>
              );
            })}
          </div>

          {refused ? (
            <div
              style={{
                flex: 'none', borderTop: '2px solid var(--color-accent)',
                padding: '10px 12px', background: 'var(--color-accent-100)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, color: 'var(--color-accent-800)' }}>
                {REFUSAL.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-accent-800)', marginTop: 3 }}>{REFUSAL.reason}</div>
              <div style={{ fontSize: 10.5, color: 'var(--color-accent-700)', marginTop: 5 }}>
                Override requires the <span className="mono">{REFUSAL.grant}</span> grant — you do not hold it.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
