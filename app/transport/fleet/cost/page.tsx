'use client';

/* TM-5 — Fleet cost.
 * The director's question: what does this cost to run, and which vehicle is the
 * outlier. Charts only where a chart earns its place — the rest is mono and
 * column-aligned so a finance director can read straight down. */

import { AC, CAUTION_TEXT, COST_CALLOUT, COST_MONTH, COST_NOTE_YTD, COST_ROWS, N6, N7, TX, VARIANCE } from '@/lib/data';

export default function FleetCost() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '14px 18px 10px' }}>
        <h3 style={{ margin: 0 }}>What the fleet costs</h3>
        <div style={{ fontSize: 11.5, color: N7, paddingBottom: 3 }}>{COST_MONTH} · 38 active vehicles · illustrative</div>
      </div>

      {/* flex:1 so the 2px rule between the two columns runs the full height of
          the screen rather than stopping where the shorter column ends. */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '2px solid var(--color-divider)', minHeight: 0 }}>
        <div style={{ borderRight: '2px solid var(--color-divider)', padding: '14px 18px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: N6, marginBottom: 8 }}>
            Cost of running
          </div>
          {/* ⚠⚠ Illustrative figures for the Gain demo (lib/data.ts COST_ROWS).
              The month label says so on screen. Do not round or re-derive any of
              them to make a column line up. */}
          {COST_ROWS.map((c) => (
            <div
              key={c.label}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0',
                borderBottom: '1px solid var(--color-neutral-300)',
              }}
            >
              <div style={{ fontSize: 12.5, paddingLeft: c.indent, color: c.muted ? N7 : TX }}>{c.label}</div>
              <div className="mono" style={{ marginLeft: 'auto', fontSize: 13, textAlign: 'right', minWidth: 110 }}>
                {c.value}
              </div>
              <div className="mono" style={{ fontSize: 11.5, color: N6, textAlign: 'right', minWidth: 90 }}>
                {c.extra}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 11.5 }}>
              Third-party carriers ran <span className="mono">{COST_NOTE_YTD.month}</span> in July against a
              year-to-date <span className="mono">{COST_NOTE_YTD.ytd}</span> across {COST_NOTE_YTD.carriers} carriers.
              Every hired trip on the board is priced against this line.
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: N6 }}>
              Fuel variance against target
            </div>
            <div style={{ fontSize: 11, color: N6, marginLeft: 'auto' }}>July</div>
          </div>

          {VARIANCE.map((r) => {
            // 4% of the track per percentage point, capped at 48% so the bar can
            // never cross the centre line it is measured from.
            const w = Math.min(Math.abs(r.v) * 4, 48);
            const left = r.v < 0 ? 50 - w : 50;
            const color = r.v < -3 ? AC : r.v < 0 ? CAUTION_TEXT : N7;
            return (
              <div
                key={r.reg}
                style={{
                  display: 'grid', gridTemplateColumns: '96px 1fr 68px', gap: 10, alignItems: 'center',
                  padding: '5px 0', borderBottom: '1px solid var(--color-neutral-300)',
                }}
              >
                <div className="mono" style={{ fontSize: 12, color: r.v < -9 ? AC : TX }}>{r.reg}</div>
                <div style={{ height: 12, position: 'relative', background: 'var(--color-neutral-200)' }}>
                  <div style={{ position: 'absolute', left: '50%', top: -2, bottom: -2, width: 1, background: 'var(--color-neutral-500)' }} />
                  <div style={{ position: 'absolute', top: 0, height: 12, left: `${left}%`, width: `${w}%`, background: color }} />
                </div>
                <div className="mono" style={{ fontSize: 12, textAlign: 'right', color }}>{r.pct}</div>
              </div>
            );
          })}

          <div style={{ marginTop: 12, padding: '10px 12px', border: '1px solid var(--color-accent)', background: 'var(--color-accent-100)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--color-accent-800)' }}>
              <span className="mono">AHB2107</span> {COST_CALLOUT}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
