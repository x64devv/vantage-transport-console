/* Nearest-neighbour stop ordering from the depot.
 *
 * ⚠ This is advice, not an instruction, and it is not a real optimiser — it is
 * a greedy walk that takes the closest unvisited stop each time. It is honest
 * about what it is: the suggestion panel shows the road figures and the minute
 * saving, and the planner can reject it. A rejection is recorded and stays
 * queryable, because the planner usually knows something the geometry does not
 * (a customer who is only home after two, a road that floods).
 *
 * Real optimisation moves server-side at build phase B11 of the module.
 */

import { DEPOT, co } from './data';
import { haversineKm } from './routing';

export function nearestNeighbour<T extends { suburb: string }>(stops: T[]): T[] {
  const rest = stops.slice();
  const out: T[] = [];
  let cur: [number, number] = [DEPOT.lat, DEPOT.lng];
  while (rest.length) {
    let bi = 0;
    let bd = Infinity;
    rest.forEach((s, i) => {
      const d = haversineKm(cur, co(s.suburb));
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    const pick = rest.splice(bi, 1)[0];
    out.push(pick);
    cur = co(pick.suburb);
  }
  return out;
}
