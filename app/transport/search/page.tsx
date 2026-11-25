'use client';

/* TM-4 — Search. The closing screen, and the only one showing something a paper
 * process cannot do at all: one number, and everything it touches. */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EVIDENCE, N6, N7, RECORD, SEARCH_CHIPS, SEARCH_CLOSE, SEARCH_EMPTY, SEARCH_KEYS,
} from '@/lib/data';

/* Prefix match in either direction, three characters or more — the same rule for
   an invoice, a serial, a registration and a name, because the argument of this
   screen is that they are one record. */
function matches(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length <= 2) return false;
  return SEARCH_KEYS.some((k) => k.indexOf(q) === 0 || q.indexOf(k) === 0);
}

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const hit = matches(query);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ padding: '22px 26px 14px', borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 900 }}>
          <input
            className="input mono"
            style={{ fontSize: 20, minHeight: 52, padding: '8px 14px', background: 'var(--color-bg)' }}
            placeholder="Invoice, serial, vehicle registration or customer name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" style={{ minHeight: 52, padding: '0 18px', fontSize: 14 }} type="button">
            Find
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: N6 }}>Try</span>
          {/* ⚠ All four resolve to the same record. That is the whole argument of
              the screen — not a convenience, a claim about identity. */}
          {SEARCH_CHIPS.map((c) => (
            <button
              key={c}
              className="btn btn-secondary mono"
              style={{ fontSize: 11.5 }}
              type="button"
              onClick={() => setQuery(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {!hit ? (
        <div style={{ padding: '40px 26px', fontSize: 13, color: N7, maxWidth: 640 }}>{SEARCH_EMPTY}</div>
      ) : (
        <div style={{ padding: '18px 26px 30px', maxWidth: 1020 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>
              Invoice <span className="mono" style={{ fontWeight: 400 }}>414414</span>
            </h3>
            <span className="tag tag-accent" style={{ fontSize: 10.5 }}>Delivered · complete</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: N6 }}>
              one continuous record · every figure is evidence, not a reference
            </span>
          </div>

          {RECORD.map((r) => (
            <div
              key={r.label}
              style={{
                display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, padding: '7px 0',
                borderBottom: '1px solid var(--color-neutral-300)',
              }}
            >
              <div style={{ fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: N6, paddingTop: 2 }}>
                {r.label}
              </div>
              <div className="mono" style={{ fontSize: 12.5, whiteSpace: 'pre-line' }}>{r.value}</div>
            </div>
          ))}

          <div
            style={{
              display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, padding: '12px 0',
              borderBottom: '1px solid var(--color-neutral-300)',
            }}
          >
            <div style={{ fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: N6 }}>Evidence</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {/* ⚠⚠ Labelled placeholders, and they say so on their face. Real proof
                  comes from the driver app's capture, which is not built. A stock
                  photograph of an identity document here would be a lie about what
                  the system holds — and about whose document it is. */}
              {EVIDENCE.map((p) => (
                <div key={p.kind} style={{ width: 150 }}>
                  <div
                    style={{
                      height: 104, background: 'var(--color-neutral-300)',
                      border: '1px solid var(--color-divider)', display: 'grid', placeItems: 'center',
                      fontSize: 10.5, color: N7, textAlign: 'center', padding: 6,
                    }}
                  >
                    {p.kind}
                    <br />
                    placeholder
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: N6, marginTop: 3 }}>{p.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 26, marginTop: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 11.5, color: N7, maxWidth: 520 }}>{SEARCH_CLOSE}</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {/* ⚠ In the design, not wired. Dimmed and labelled so it is never a dead control. */}
              <button
                className="btn btn-secondary" type="button" disabled
                title="Not wired in this demo" style={{ opacity: 0.45, cursor: 'not-allowed' }}
              >
                Export record · not in this demo
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => router.push('/transport/live')}>
                Open trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
