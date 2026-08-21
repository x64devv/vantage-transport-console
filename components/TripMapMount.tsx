'use client';

/* Leaflet cannot be server-rendered — it reaches for `window` on import. This is
   the ssr:false boundary the handoff calls for. */

import dynamic from 'next/dynamic';
import type { TripMapProps } from './TripMap';

const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'absolute', inset: 0, background: 'var(--color-surface)',
        display: 'grid', placeItems: 'center',
        fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
        color: 'var(--color-neutral-600)',
      }}
    >
      Map loading
    </div>
  ),
});

export default function TripMapMount(props: TripMapProps) {
  return <TripMap {...props} />;
}
