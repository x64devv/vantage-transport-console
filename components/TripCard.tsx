'use client';

import { useRouter } from 'next/navigation';
import type { TripCard as Card } from '@/lib/data';
import { LoadLine } from './LoadLine';

export function TripCardView({ t, href }: { t: Card; href: string }) {
  const router = useRouter();
  return (
    <div
      role="link"
      tabIndex={0}
      className="card-hover focusable"
      onClick={() => router.push(href)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(href); } }}
      style={{
        cursor: 'pointer', background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)', borderLeft: `3px solid ${t.edge}`,
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{t.id}</span>
        <span className="tag tag-outline" style={{ fontSize: 10 }}>{t.zone}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: t.statusColor }}>{t.status}</span>
      </div>
      <div className="mono" style={{ fontSize: 11.5, marginTop: 4 }}>{t.vehicle}</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 7, alignItems: 'center' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-neutral-700)' }}>
          {t.progress ?? `${t.stops} stops`}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-neutral-700)' }}>
          {t.serviceText ?? `${t.service} min`}
        </div>
      </div>
      <div style={{ marginTop: 7, paddingTop: 7, borderTop: '1px solid var(--color-neutral-300)' }}>
        <LoadLine text={t.capText} pct={t.capPct} textOnly={!!t.progress} />
      </div>
    </div>
  );
}
