'use client';

/* App chrome: header bar, branch sync strip, left rail, demo running-order bar.
 * Present on every screen. Recreated from the prototype's markup at the same
 * densities — 2px rules between regions, 1px between rows, radius 0 throughout.
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AC, AC7, BEATS, BRANCHES, CLOCK, N4, N6, N7, RAIL, SYNC_NOTE } from '@/lib/data';
import { useConsole } from './ConsoleState';

const LABEL: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'var(--color-neutral-600)',
};

export function Header() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 20, padding: '10px 18px',
        borderBottom: '2px solid var(--color-divider)', flex: 'none',
      }}
    >
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, letterSpacing: '-.01em' }}>
        VANTAGE <span style={{ color: 'var(--color-accent)' }}>TRANSPORT MANAGEMENT</span>
      </div>
      <div style={{ ...LABEL, borderLeft: '1px solid var(--color-divider)', paddingLeft: 20 }}>
        Harare depot · planner view
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* ⚠ A fixed clock. The demo is set on Thursday 20 August 2026 at 07:15 and
            every timestamp on every screen is relative to it. A live clock would
            drift away from the seeded day within a minute. */}
        <div className="mono" style={{ fontSize: 12 }}>{CLOCK}</div>
        <div style={{ width: 1, height: 18, background: 'var(--color-divider)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-neutral-700)' }}>
          <span style={{ width: 7, height: 7, background: 'var(--color-accent)', display: 'block' }} />
          Cartrack live
        </div>
      </div>
    </div>
  );
}

/* ⚠⚠ One of the four things that must survive. Marondera has not synced since
   14:32 and the strip says so, next to the branches that have. The alternative —
   a board that looks complete because it silently dropped a branch — is the
   failure this whole console argues against. */
export function SyncStrip() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'stretch', flex: 'none',
        borderBottom: '1px solid var(--color-divider)', background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          ...LABEL, padding: '6px 14px', borderRight: '1px solid var(--color-divider)',
          display: 'flex', alignItems: 'center',
        }}
      >
        Branch sync
      </div>
      {BRANCHES.map((b) => (
        <div
          key={b.code}
          style={{
            padding: '6px 12px', borderRight: '1px solid var(--color-divider)',
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, display: 'block', background: b.live ? AC : N4 }} />
          <span style={{ fontSize: 11.5 }}>{b.name}</span>
          <span className="mono" style={{ fontSize: 11, color: b.live ? N7 : AC7 }}>{b.stamp}</span>
        </div>
      ))}
      <div
        style={{
          marginLeft: 'auto', padding: '6px 14px', display: 'flex', alignItems: 'center',
          fontSize: 11, color: 'var(--color-accent-700)',
        }}
      >
        {SYNC_NOTE}
      </div>
    </div>
  );
}

export function Rail() {
  const pathname = usePathname();
  const norm = (p: string) => p.replace(/\/$/, '');
  return (
    <div
      style={{
        width: 186, flex: 'none', borderRight: '2px solid var(--color-divider)',
        display: 'flex', flexDirection: 'column', background: 'var(--color-surface)',
      }}
    >
      <div style={{ ...LABEL, padding: '12px 14px 6px' }}>Today</div>
      {RAIL.map((item) => {
        const on = norm(pathname) === norm(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rail-item focusable"
            style={{
              textDecoration: 'none', color: 'var(--color-text)', cursor: 'pointer',
              padding: '9px 14px', display: 'flex', flexDirection: 'column', gap: 2,
              borderLeft: `3px solid ${on ? AC : 'transparent'}`,
              background: on ? 'var(--color-bg)' : 'transparent',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13 }}>{item.title}</div>
            <div className="mono" style={{ fontSize: 10, color: N6 }}>{item.sub}</div>
          </Link>
        );
      })}
      <div
        style={{
          marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid var(--color-divider)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        <Link
          href="/transport/notes"
          style={{ fontSize: 11, textDecoration: 'none', border: '1px solid var(--color-divider)', padding: '6px 8px', display: 'block' }}
        >
          Screen notes ↗
        </Link>
        <div style={{ fontSize: 10.5, lineHeight: 1.5, color: 'var(--color-neutral-700)' }}>
          Store dispatch and the driver app are a separate mobile build.
        </div>
      </div>
    </div>
  );
}

/* ⚠⚠ Demo scaffolding. Behind NEXT_PUBLIC_DEMO_BAR — set it to "off" and the
   console is a product screen with no running order at the foot of it. Beats 4
   to 10 are the mobile build; they render at 0.35 opacity and clicking one moves
   the beat without pretending a screen exists for it. */
export function DemoBar() {
  const { beat, setBeat } = useConsole();
  const router = useRouter();
  const b = BEATS[beat];

  const go = (i: number) => {
    setBeat(i);
    const route = BEATS[i].route;
    if (route) router.push(route);
  };

  return (
    <div
      style={{
        flex: 'none', borderTop: '2px solid var(--color-divider)',
        background: 'var(--color-text)', color: 'var(--color-bg)',
        display: 'flex', alignItems: 'stretch',
      }}
    >
      <div
        style={{
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
          borderRight: '1px solid rgba(243,242,242,.25)',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.6 }}>
          Running order
        </span>
        <span className="mono" style={{ fontSize: 12 }}>{b.n}/13</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', minWidth: 0 }}>
        <span className="mono" style={{ fontSize: 10.5, opacity: 0.6 }}>{b.screen}</span>
        <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {b.line}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px' }}>
        {BEATS.map((x, i) => (
          <button
            key={x.n}
            type="button"
            title={x.line}
            onClick={() => go(i)}
            className="focusable"
            style={{
              cursor: 'pointer', width: 20, height: 20, display: 'grid', placeItems: 'center',
              fontSize: 10, fontFamily: 'ui-monospace, Menlo, monospace',
              background: i === beat ? AC : 'transparent',
              color: '#f3f2f2', opacity: x.route ? (i === beat ? 1 : 0.75) : 0.35,
              border: 'none', padding: 0, borderRadius: 0,
            }}
          >
            {x.n}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          borderLeft: '1px solid rgba(243,242,242,.25)',
        }}
      >
        <button
          className="btn"
          type="button"
          style={{ color: 'var(--color-bg)', borderColor: 'rgba(243,242,242,.35)' }}
          onClick={() => go(Math.max(0, beat - 1))}
        >
          Prev
        </button>
        <button className="btn btn-primary" type="button" onClick={() => go(Math.min(BEATS.length - 1, beat + 1))}>
          Next beat
        </button>
      </div>
    </div>
  );
}
