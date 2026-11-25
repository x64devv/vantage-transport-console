'use client';

/* The whole console's state, in one client-side store.
 *
 * ⚠ Demo only. In the real module every one of these becomes a gateway read or
 * write — /api/transport/consignments, trips, stops, compliance-guarded vehicle
 * assignment, exceptions and the trace query — and positions come from Cartrack
 * server-side, with the credentials never in the browser.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Consignment, SEED_STOPS, SEED_TRIP_ID, SEED_TRIP_ZONE, NEW_TRIP_ID, POOL_ALL,
} from '@/lib/data';
import { Road, cachedRoute, fetchRoute, orderKey } from '@/lib/routing';
import { nearestNeighbour } from '@/lib/optimise';

type Ctx = {
  tripId: string;
  tripZone: string;
  stops: Consignment[];
  pool: Consignment[];
  assigned: string | null;
  refused: boolean;
  suggestion: Consignment[] | null;
  rejected: boolean;
  road: (list: Consignment[]) => Road | undefined;
  addStop: (c: Consignment) => void;
  removeStop: (inv: string) => void;
  clearStops: () => void;
  newTrip: () => void;
  previewRoute: () => void;
  acceptRoute: () => void;
  rejectRoute: () => void;
  assign: (reg: string) => void;
  showRefusal: () => void;
  beat: number;
  setBeat: (n: number) => void;
};

const ConsoleCtx = createContext<Ctx | null>(null);

/* ⚠ A reload must not lose the trip being built — someone will refresh mid-demo,
   or the projector will renegotiate and the tab reloads. sessionStorage, not
   localStorage: it survives a reload and dies with the tab, so a rehearsal never
   leaks into the real run. Suggestions and road answers are recomputed. */
const STORE_KEY = 'vantage-console-v1';
type Saved = {
  tripId: string; tripZone: string; stops: Consignment[];
  assigned: string | null; rejected: boolean; beat: number;
};

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [tripId, setTripId] = useState(SEED_TRIP_ID);
  const [tripZone, setTripZone] = useState(SEED_TRIP_ZONE);
  const [stops, setStops] = useState<Consignment[]>(SEED_STOPS);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [refused, setRefused] = useState(false);
  const [suggestion, setSuggestion] = useState<Consignment[] | null>(null);
  const [rejected, setRejected] = useState(false);
  const [beat, setBeat] = useState(0);

  /* Road answers, keyed on the stop order. Seeded orders resolve from the
     shipped cache with no network at all; anything else is asked of OSRM once
     and remembered. Until an answer exists the estimate says "(routing…)". */
  const [roads, setRoads] = useState<Record<string, Road>>({});

  const road = useCallback(
    (list: Consignment[]) => {
      const key = orderKey(list.map((s) => s.suburb));
      return cachedRoute(list.map((s) => s.suburb)) || roads[key];
    },
    [roads],
  );

  const ensureRoute = useCallback((list: Consignment[]) => {
    if (!list.length) return;
    const suburbs = list.map((s) => s.suburb);
    const key = orderKey(suburbs);
    if (cachedRoute(suburbs)) return;
    fetchRoute(suburbs).then((r) => {
      if (r) setRoads((p) => (p[key] ? p : { ...p, [key]: r }));
    });
  }, []);

  useEffect(() => { ensureRoute(stops); }, [stops, ensureRoute]);
  useEffect(() => { if (suggestion) ensureRoute(suggestion); }, [suggestion, ensureRoute]);

  /* Restore after mount (the export is prerendered, so the first paint must match
     the seed), and only start saving once that has happened. */
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        if (Array.isArray(s.stops)) {
          setTripId(s.tripId); setTripZone(s.tripZone); setStops(s.stops);
          setAssigned(s.assigned); setRejected(!!s.rejected); setBeat(s.beat || 0);
        }
      }
    } catch { /* storage blocked or the entry is unreadable — the seed stands */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      const s: Saved = { tripId, tripZone, stops, assigned, rejected, beat };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch { /* storage blocked — the console still works, it just forgets on reload */ }
  }, [restored, tripId, tripZone, stops, assigned, rejected, beat]);

  const pool = useMemo(
    () => POOL_ALL.filter((c) => !stops.some((s) => s.inv === c.inv)),
    [stops],
  );

  const addStop = useCallback((c: Consignment) => {
    setStops((p) => p.concat([c]));
    setSuggestion(null);
  }, []);

  const removeStop = useCallback((inv: string) => {
    setStops((p) => p.filter((s) => s.inv !== inv));
    setSuggestion(null);
  }, []);

  const clearStops = useCallback(() => { setStops([]); setSuggestion(null); }, []);

  const newTrip = useCallback(() => {
    setTripId(NEW_TRIP_ID);
    setTripZone('Zone C — new');
    setStops([]);
    setAssigned(null);
    setRefused(false);
    setSuggestion(null);
    setRejected(false);
  }, []);

  const previewRoute = useCallback(() => {
    if (stops.length < 2) return; // nothing to reorder — the button is a no-op, not an error
    setSuggestion(nearestNeighbour(stops));
    setRejected(false);
  }, [stops]);

  const acceptRoute = useCallback(() => {
    setSuggestion((s) => {
      if (s) setStops(s);
      return null;
    });
    setRejected(false);
  }, []);

  /* ⚠ A rejection is not a no-op. The optimiser is advice; the planner usually
     knows something the geometry does not. The note is shown, and in the real
     module the rejection is recorded and stays queryable. */
  const rejectRoute = useCallback(() => { setSuggestion(null); setRejected(true); }, []);

  const assign = useCallback((reg: string) => { setAssigned(reg); setRefused(false); }, []);
  const showRefusal = useCallback(() => { setRefused(true); }, []);

  const value = useMemo<Ctx>(
    () => ({
      tripId, tripZone, stops, pool, assigned, refused, suggestion, rejected, road,
      addStop, removeStop, clearStops, newTrip, previewRoute, acceptRoute, rejectRoute,
      assign, showRefusal, beat, setBeat,
    }),
    [
      tripId, tripZone, stops, pool, assigned, refused, suggestion, rejected, road,
      addStop, removeStop, clearStops, newTrip, previewRoute, acceptRoute, rejectRoute,
      assign, showRefusal, beat,
    ],
  );

  return <ConsoleCtx.Provider value={value}>{children}</ConsoleCtx.Provider>;
}

export function useConsole() {
  const ctx = useContext(ConsoleCtx);
  if (!ctx) throw new Error('useConsole must be used inside <ConsoleProvider>');
  return ctx;
}
