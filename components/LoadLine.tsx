'use client';

/* ⚠⚠ The load line — the quiet one of the four things that must survive.
 *
 * There are exactly two legitimate forms and no third:
 *
 *   measured    "Load"  7.07 of 22.0 m³ — 32%   + a 6px bar at 32%
 *   unmeasured  "LOAD"  5 lines with no dimensions        "no % shown", NO BAR
 *
 * Nine trips in ten are the second, because TVSH holds no cube data for
 * furniture. A zero-width bar, a greyed bar, an empty chart or an estimated
 * percentage would each be a lie about what the system knows — and would make
 * the ordinary case look like a fault. It is not a fault. It is Thursday.
 */

import { N6 } from '@/lib/data';

export function LoadLine({
  text, pct, textOnly = false,
}: {
  text: string;
  pct: number | null;
  /** Running trips show the line as text only — no bar even when measured. */
  textOnly?: boolean;
}) {
  if (pct != null && !textOnly) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--color-neutral-700)' }}>
          <span>Load</span>
          <span className="mono">{text}</span>
        </div>
        <div style={{ height: 6, background: 'var(--color-neutral-300)', marginTop: 4 }}>
          <div style={{ height: 6, background: 'var(--color-accent)', width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 10.5, color: N6, letterSpacing: '.06em', textTransform: 'uppercase' }}>Load</span>
      <span className="mono" style={{ fontSize: 11 }}>{text}</span>
      {!textOnly ? (
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: N6 }}>no % shown</span>
      ) : null}
    </div>
  );
}
