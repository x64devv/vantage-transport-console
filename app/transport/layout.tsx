'use client';

import { ConsoleProvider } from '@/components/ConsoleState';
import { DemoBar, Header, Rail, SyncStrip } from '@/components/Chrome';

/* ⚠ The demo running-order bar is scaffolding. Build with
   NEXT_PUBLIC_DEMO_BAR=off and it is gone; nothing else on any screen depends
   on it. In a product build it is dropped, not hidden. */
const DEMO_BAR = process.env.NEXT_PUBLIC_DEMO_BAR !== 'off';

/* The design is a fixed 1600 × 1000 working area, used for hours by two roles at
   a desk. It is centred on the neutral-300 desk rather than stretched, so the
   densities the design was drawn at survive whatever the demo laptop's screen
   turns out to be. */
export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'start center', padding: 0 }}>
      <ConsoleProvider>
        <div
          style={{
            width: 1600,
            height: DEMO_BAR ? 1000 : 963,
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
      </ConsoleProvider>
    </div>
  );
}
