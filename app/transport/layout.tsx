'use client';

import { useEffect, useState } from 'react';
import { ConsoleProvider } from '@/components/ConsoleState';
import { DemoBar, Header, Rail, SyncStrip } from '@/components/Chrome';

/* ⚠ The demo running-order bar is scaffolding. Build with
   NEXT_PUBLIC_DEMO_BAR=off and it is gone; nothing else on any screen depends
   on it. In a product build it is dropped, not hidden. */
const DEMO_BAR = process.env.NEXT_PUBLIC_DEMO_BAR !== 'off';

/* The design is a fixed 1600 × 1000 working area, used for hours by two roles at
   a desk. It is centred on the neutral-300 desk (and scaled down to fit) rather than stretched, so the
   densities the design was drawn at survive whatever the demo laptop's screen
   turns out to be. */
const W = 1600;
const H = DEMO_BAR ? 1000 : 963;

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  /* ⚠ Fit to the window (28 Nov): the page must never scroll in front of the
     room. The 1600 × H working area is scaled down as one piece, so the drawn
     densities keep their proportions; it is never scaled above full size.
     Same approach as the dispatch tablet. Leaflet 1.9 reads the ancestor scale,
     so map clicks still land. */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'grid', placeItems: 'center', padding: 0 }}>
      <ConsoleProvider>
        <div style={{ width: W * scale, height: H * scale }}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: W,
            height: H,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            overflow: 'hidden',
          }}
        >
          <Header />
          <SyncStrip />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <Rail />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
          </div>
          {DEMO_BAR ? <DemoBar /> : null}
        </div>
        </div>
      </ConsoleProvider>
    </div>
  );
}
