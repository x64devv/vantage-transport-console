/* Road distance and driving time for a stop order.
 *
 * ⚠⚠ The rule this file exists to keep: never let a straight line pretend to be
 * a route, and never print a figure the router did not give us without saying so.
 * Until a road answer lands, the estimate line appends "(routing…)" and the map
 * draws its legs dashed. If the router never answers, both stay that way.
 */

import { DEPOT, co } from './data';
import { CACHED_ROUTES } from './routes-cache';

export type Road = { km: number; min: number; coords?: [number, number][] };

/** City allowance on OSRM's free-flow duration. Harare traffic, agreed at design. */
export const CITY_FACTOR = 1.18;

export const orderKey = (suburbs: string[]) => suburbs.join('>');

/** Straight-line kilometres with a 1.35 road-winding allowance — the fallback,
 *  and only ever shown alongside a "(routing…)" marker or a dashed line. */
export function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la = (a[0] * Math.PI) / 180;
  const lb = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * 1.35;
}

export function straightLineKm(suburbs: string[]) {
  let d = 0;
  let prev: [number, number] = [DEPOT.lat, DEPOT.lng];
  suburbs.forEach((s) => {
    const c = co(s);
    d += haversineKm(prev, c);
    prev = c;
  });
  return d + haversineKm(prev, [DEPOT.lat, DEPOT.lng]);
}

/* ── The cache ────────────────────────────────────────────────────────────
   ⚠⚠ OSRM's public demo server is rate-limited and is a third party on the far
   side of a boardroom's wifi. The routes for the seeded stop orders are baked
   into routes-cache.ts at build time, so the demo never waits on it. Live
   routing is a bonus for orders the planner invents in the room, not a
   dependency for the ones in the script. */
const memory: Record<string, Road> = { ...CACHED_ROUTES };

export const cachedRoute = (suburbs: string[]): Road | undefined => memory[orderKey(suburbs)];

const inFlight = new Set<string>();

export const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving/';

export function osrmUrl(suburbs: string[], geometry: boolean) {
  const pts: [number, number][] = [
    [DEPOT.lat, DEPOT.lng],
    ...suburbs.map((s) => co(s)),
    [DEPOT.lat, DEPOT.lng],
  ];
  return (
    OSRM_BASE +
    pts.map((p) => p[1].toFixed(5) + ',' + p[0].toFixed(5)).join(';') +
    (geometry ? '?overview=full&geometries=geojson' : '?overview=false')
  );
}

/** Ask OSRM for a stop order we do not already hold. Resolves to undefined when
 *  the router is unreachable — the caller must keep showing "(routing…)". */
export async function fetchRoute(suburbs: string[]): Promise<Road | undefined> {
  const key = orderKey(suburbs);
  if (memory[key]) return memory[key];
  if (!suburbs.length || inFlight.has(key)) return undefined;
  inFlight.add(key);
  try {
    const res = await fetch(osrmUrl(suburbs, true));
    const json = await res.json();
    const rt = json?.routes?.[0];
    if (!rt) return undefined;
    const road: Road = {
      km: rt.distance / 1000,
      min: rt.duration / 60,
      coords: rt.geometry?.coordinates?.map((c: [number, number]) => [c[1], c[0]] as [number, number]),
    };
    memory[key] = road;
    return road;
  } catch {
    // Offline or rate-limited. The dashed provisional line stays; that is correct.
    return undefined;
  } finally {
    inFlight.delete(key);
  }
}

export type Estimate = {
  service: number;
  km: number;
  drive: number;
  total: number;
  back: string;
  isRoad: boolean;
};

/** 06:45 + n minutes, as HH:MM. */
export function departPlus(mins: number) {
  const t = 6 * 60 + 45 + Math.round(mins);
  return String(Math.floor(t / 60) % 24).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}

export function estimate(stops: { suburb: string; service: number }[], road?: Road): Estimate {
  const service = stops.reduce((a, s) => a + s.service, 0);
  const suburbs = stops.map((s) => s.suburb);
  const km = road ? road.km : stops.length ? straightLineKm(suburbs) : 0;
  // ⚠ Driving minutes come from the router's duration × the city factor. The
  //   fallback divides the straight-line distance by 26 km/h and is only ever
  //   shown with "(routing…)" beside it.
  const drive = road ? Math.round(road.min * CITY_FACTOR) : Math.round((km / 26) * 60);
  const total = service + drive;
  return { service, km: Math.round(km), drive, total, back: departPlus(total), isRoad: !!road };
}
