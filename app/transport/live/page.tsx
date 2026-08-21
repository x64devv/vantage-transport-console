'use client';

/* TM-3 — Live and exceptions.
 * Where the trucks are, how honest the ETA is, and everything that went wrong. */

import { useState } from 'react';
import {
  DEPOT, EXCEPTIONS, EXCEPTIONS_FOOT, LIVE_TRIPS, LIVE_VEHICLES, N6, N7, UNPLANNED, co,
} from '@/lib/data';
import TripMapMount from '@/components/TripMapMount';

export default function Live() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '14px 18px 10px' }}>
        <h3 style={{ margin: 0 }}>Live &amp; exceptions</h3>
        <div style={{ fontSize: 11.5, color: N7, paddingBottom: 3 }}>
          Every timestamp names its source. Where a fix is stale the position is absent and says so.
        </div>
      </div>

      <div
        style={{
          flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: '1fr 1fr',
          borderTop: '2px solid var(--color-divider)',
        }}
      >
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 560px', minHeight: 0,
            borderBottom: '2px solid var(--color-divider)',
          }}
        >
          <div style={{ overflow: 'auto', borderRight: '2px solid var(--color-divider)' }}>
            <table className="table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Trip</th><th>Vehicle</th><th>Driver</th><th>Stops</th><th>Position</th><th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {/* ⚠⚠ Trip 02 has no position and no ETA, and both cells say why.
                    A last-known dot is a lie the moment it is an hour old, and an
                    ETA computed from a lie is worse than no ETA at all. */}
                {LIVE_TRIPS.map((t) => (
                  <tr key={t.id}>
                    <td className="mono" style={{ fontSize: 11.5 }}>{t.id}</td>
                    <td className="mono" style={{ fontSize: 11.5 }}>{t.vehicle}</td>
                    <td>{t.driver}</td>
                    <td className="mono">{t.stops}</td>
                    <td style={{ fontSize: 11.5, color: t.posColor }}>
                      {t.position}
                      <div className="mono" style={{ fontSize: 10, color: N6 }}>{t.posSource}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 11.5 }}>
                      {t.eta}
                      <div style={{ fontSize: 10, color: N6 }}>{t.etaNote}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ position: 'relative' }}>
            <TripMapMount
              center={[-17.84, 31.06]}
              zoom={11}
              depot={DEPOT}
              vehicles={LIVE_VEHICLES}
              pins={UNPLANNED.map((c) => ({ label: c.inv, lat: co(c.suburb)[0], lng: co(c.suburb)[1] }))}
            />
            <div
              style={{
                position: 'absolute', right: 10, bottom: 22, zIndex: 500,
                background: 'var(--color-bg)', padding: '6px 9px', fontSize: 10,
                lineHeight: 1.7, boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 9, height: 9, background: 'var(--color-text)', display: 'block' }} />
                vehicle · live fix
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 9, height: 9, background: 'var(--color-accent)', display: 'block' }} />
                unplanned delivery
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              padding: '8px 18px', display: 'flex', alignItems: 'baseline', gap: 10,
              borderBottom: '1px solid var(--color-divider)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Exceptions
            </span>
            <span style={{ fontSize: 11, color: N6 }}>oldest first · fault is a billing field, not an accusation</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 18px' }}>
            <table className="table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ width: 150 }}>Reference</th>
                  <th>What</th>
                  <th style={{ width: 64 }}>Raised</th>
                  <th style={{ width: 120 }}>By</th>
                  <th style={{ width: 96 }}>Fault</th>
                  <th style={{ width: 230 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {EXCEPTIONS.map((e, i) => (
                  <tr
                    key={e.ref}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    <td className="mono" style={{ fontSize: 11, verticalAlign: 'top' }}>{e.ref}</td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: N7 }}>{e.detail}</div>
                      {expanded === i ? (
                        <div style={{ fontSize: 11, color: 'var(--color-accent-700)', marginTop: 3 }}>{e.expanded}</div>
                      ) : null}
                    </td>
                    <td className="mono" style={{ verticalAlign: 'top' }}>{e.raised}</td>
                    <td style={{ verticalAlign: 'top', fontSize: 11.5 }}>{e.by}</td>
                    {/* ⚠ Fault is a billing field. It is styled as a fact — a plain
                        neutral tag — and never as an accusation against a driver. */}
                    <td style={{ verticalAlign: 'top' }}>
                      <span className="tag tag-neutral" style={{ fontSize: 10.5 }}>{e.fault}</span>
                    </td>
                    <td style={{ verticalAlign: 'top', fontSize: 11.5, color: e.statusColor }}>{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '8px 0 16px', fontSize: 11, color: N7 }}>{EXCEPTIONS_FOOT}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
