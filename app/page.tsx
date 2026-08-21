'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/* The console has no home of its own — the board is the day's first screen.
 * ⚠ `redirect()` is a server-side answer and there is no server here
 * (output: 'export'), so this bounces client-side and leaves a real link behind
 * for anyone who lands with JavaScript off. */
export default function Root() {
  const router = useRouter();
  useEffect(() => { router.replace('/transport/board'); }, [router]);
  return (
    <div style={{ padding: 40, fontFamily: 'var(--font-body)', fontSize: 13 }}>
      <Link href="/transport/board">Vantage Transport Management → the board</Link>
    </div>
  );
}
