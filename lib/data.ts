/* Seed data for the Vantage Transport Management demo console — GAIN RE-SEED.
 *
 * ⚠⚠ ILLUSTRATIVE DATA, NOT GAIN'S RECORDS. Re-seeded 25 Nov 2026 for the Gain
 * demo (URD 10.11 / 10.12) from the shared map in ../GAIN-RESEED.md, which the
 * dispatch tablet and the driver app follow too. No Gain branch list, fleet
 * register or customer data was available, so every branch name, registration,
 * fleet number, consignment and figure below is invented for the demo, and the
 * chrome says so on every screen. When real Gain data arrives, this file and
 * ../GAIN-RESEED.md are what get replaced.
 *
 * ⚠⚠ TVSH's real records must not reach a Gain room. The previous build of this
 *   file carried TVSH's Fleet Register registrations, its April 2026 Transport
 *   Report figures and the fiscal signature of a real invoice. All are gone.
 * ⚠ Kept from the earlier build because they are geography, not anyone's
 *   records: Harare suburbs and their centroids, the zone letters, every trip id,
 *   clock time and route figure (lib/routes-cache.ts is still valid).
 */

export const AC = '#ec3013';
export const AC7 = '#ae1800';
export const AC8 = '#7c1405';
export const CAUTION_EDGE = '#ff9783';
export const CAUTION_TEXT = '#9e3526';
export const N4 = '#bab6b6';
export const N6 = '#7d7979';
export const N7 = '#605d5d';
export const TX = '#201e1d';

export const CLOCK = 'Thu 20 Aug 2026 · 07:15';
export const DEPART = '06:45';

export const DEPOT = { label: 'Willowvale depot', lat: -17.877, lng: 31.005 };

/* Harare suburb centroids used for the map and the straight-line fallback.
   Real suburbs; the coordinates are approximate centroids, good enough to route
   between and honest about being illustrative. */
export const SUB: Record<string, [number, number]> = {
  Waterfalls: [-17.888, 31.025],
  Mabvuku: [-17.82, 31.18],
  Borrowdale: [-17.75, 31.1],
  Chitungwiza: [-17.993, 31.075],
  Greendale: [-17.81, 31.13],
  Kuwadzana: [-17.83, 30.92],
  Avondale: [-17.799, 31.035],
  Hatfield: [-17.862, 31.11],
  Highfield: [-17.877, 30.99],
  Newlands: [-17.806, 31.073],
  Msasa: [-17.846, 31.123],
  Eastlea: [-17.828, 31.07],
  Braeside: [-17.846, 31.062],
  Hillside: [-17.86, 31.09],
  Cranborne: [-17.86, 31.008],
};

export const co = (s: string): [number, number] => SUB[s] || [-17.84, 31.05];

/* ── Zones ────────────────────────────────────────────────────────────────
   ⚠ Illustrative for Gain: plausible Harare delivery zones, kept from the
   earlier build. The prototype's zone letters
   did not match this table (Waterfalls was tagged A, Chitungwiza E, Avondale C);
   they are now derived from the suburb, so a planner reading the board sees the
   zone he actually runs. */
export const ZONES = [
  { zone: 'A', name: 'Marlborough / Avondale', suburbs: ['Marlborough', 'Avondale', 'Mount Pleasant', 'Emerald Hill', 'Belvedere', 'Milton Park'], nominatedDays: ['Mon', 'Wed', 'Fri'] },
  { zone: 'B', name: 'Borrowdale', suburbs: ['Borrowdale', 'Gunhill', 'Highlands', 'Chisipite', 'Glen Lorne', 'Ballantyne Park'], nominatedDays: ['Tue', 'Thu', 'Sat'] },
  { zone: 'C', name: 'Greendale / East', suburbs: ['Greendale', 'Msasa Park', 'Msasa', 'Athlone', 'Mabvuku', 'Tafara', 'Chizhanje', 'Newlands', 'Eastlea'], nominatedDays: ['Mon', 'Thu'] },
  { zone: 'D', name: 'Waterfalls / South', suburbs: ['Waterfalls', 'Hatfield', 'Prospect', 'Braeside', 'Cranborne', 'Queensdale', 'Hillside'], nominatedDays: ['Tue', 'Fri'] },
  { zone: 'E', name: 'Highfield / West', suburbs: ['Budiriro', 'Glen View', 'Highfield', 'Kambuzuma', 'Warren Park', 'Kuwadzana'], nominatedDays: ['Wed', 'Sat'] },
  { zone: 'F', name: 'Chitungwiza', suburbs: ['Chitungwiza', 'Zengeza', 'St Marys', 'Seke', 'Manyame Park'], nominatedDays: ['Thu'] },
  { zone: 'G', name: 'Out of town', suburbs: ['Norton', 'Ruwa', 'Goromonzi', 'Domboshava', 'Beatrice'], nominatedDays: ['Fri'] },
];

const ZONE_OF: Record<string, string> = {};
ZONES.forEach((z) => z.suburbs.forEach((s) => { ZONE_OF[s] = z.zone; }));
/* ⚠ Newlands, Eastlea and Hillside are not in the zone table. They
   are filed against the nearest zone rather than shown blank, because a blank
   zone on the board would read as a defect. If Gain confirms a different
   allocation, this map is the one line to change. */
export const zoneOf = (suburb: string) => ZONE_OF[suburb] || 'C';

/* ── Branch sync strip ────────────────────────────────────────────────────
   ⚠⚠ Illustrative Gain branch names; the codes are kept (../GAIN-RESEED.md).
   Marondera (MD) is
   the one behind, and it is deliberately absent from the selling branches on the
   board below: its deliveries genuinely are not on this board, which is what the
   strip says out loud. */
export type Branch = { code: string; name: string; stamp: string; live: boolean };
export const BRANCHES: Branch[] = [
  { code: 'VE', name: 'Willowvale', stamp: 'live', live: true },
  { code: 'BR', name: 'Borrowdale', stamp: 'live', live: true },
  { code: 'MN', name: 'Mbare North', stamp: 'live', live: true },
  { code: 'MW', name: 'Mbare Wholesale', stamp: 'live', live: true },
  { code: 'FS', name: 'Fourth Street', stamp: 'live', live: true },
  { code: 'AV', name: 'Avondale', stamp: 'live', live: true },
  { code: 'MD', name: 'Marondera', stamp: 'last synced 14:32', live: false },
];
export const SYNC_NOTE = '1 branch behind — its deliveries are not on this board';

/* ── TM-1: the unplanned column ───────────────────────────────────────────
   43 unplanned today; nine are shown and the rest are counted. Branches are
   illustrative; zones are derived from the suburb. */
export type Consignment = {
  inv: string; customer: string; suburb: string; goods: string;
  branch: string; service: number; dims?: boolean; m3?: number;
};

export const UNPLANNED: Consignment[] = [
  { inv: '414512', customer: 'T. Chikwanha', suburb: 'Waterfalls', goods: 'Maize meal 10kg × 40', branch: 'VE Willowvale', service: 22 },
  { inv: '414518', customer: 'Grace Ndoro', suburb: 'Mabvuku', goods: 'Cooking oil 2L, 30 cases', branch: 'BR Borrowdale', service: 35 },
  { inv: '414523', customer: 'M. Nyahuye', suburb: 'Borrowdale', goods: 'Chest freezer 300L', branch: 'VE Willowvale', service: 30 },
  { inv: '414529', customer: 'Precious Zhou', suburb: 'Chitungwiza', goods: 'Sugar 2kg bales × 25', branch: 'MW Mbare Wholesale', service: 28 },
  { inv: '414534', customer: 'K. Mutasa', suburb: 'Greendale', goods: 'Soft drinks, 20 crates', branch: 'VE Willowvale', service: 26 },
  { inv: '414541', customer: 'S. Dube', suburb: 'Kuwadzana', goods: 'Rice 10kg × 30', branch: 'FS Fourth Street', service: 24 },
  { inv: '414547', customer: 'Loveness Banda', suburb: 'Avondale', goods: 'Mixed grocery order, 48 lines', branch: 'AV Avondale', service: 52 },
  { inv: '414550', customer: 'B. Marufu', suburb: 'Hatfield', goods: 'Bath soap, 24 cases', branch: 'MN Mbare North', service: 18 },
  { inv: '414556', customer: 'J. Sibanda', suburb: 'Highfield', goods: 'Bread flour 10kg × 35', branch: 'MW Mbare Wholesale', service: 19 },
];

export const UNPLANNED_TOTAL = 43;               // ⚠ real: dayShape.unplanned
export const UNPLANNED_MORE = '34 more · 8 promised before noon';

/* ── TM-2: the pool and the seeded trip ───────────────────────────────────
   `dims:false` is the ordinary case, not the exception: a line whose pack size
   is not in the item master cannot be measured, and in this illustrative day
   most mixed and loose orders are in that state. */
export const POOL_ALL: Consignment[] = [
  { inv: '414534', customer: 'K. Mutasa', suburb: 'Greendale', goods: 'Soft drinks, 20 crates', branch: 'VE Willowvale', service: 26, dims: false },
  { inv: '414547', customer: 'Loveness Banda', suburb: 'Avondale', goods: 'Mixed grocery order, 48 lines', branch: 'AV Avondale', service: 52, dims: false },
  { inv: '414561', customer: 'E. Chirwa', suburb: 'Newlands', goods: 'Loose produce + bulk salt', branch: 'BR Borrowdale', service: 44, dims: false },
  { inv: '414565', customer: 'P. Moyo', suburb: 'Msasa', goods: 'Cooking oil 2L, 12 cases', branch: 'MW Mbare Wholesale', service: 14, dims: true, m3: 0.4 },
  { inv: '414571', customer: 'N. Gwatidzo', suburb: 'Eastlea', goods: 'Mixed tuckshop order, 31 lines', branch: 'FS Fourth Street', service: 38, dims: false },
  { inv: '414574', customer: 'R. Tsvangirai', suburb: 'Braeside', goods: 'Maize meal 10kg × 40', branch: 'VE Willowvale', service: 21, dims: true, m3: 0.9 },
  { inv: '414580', customer: 'A. Chigumbu', suburb: 'Hillside', goods: 'Cleaning products, mixed', branch: 'MN Mbare North', service: 46, dims: false },
  { inv: '414588', customer: 'M. Sibanda', suburb: 'Hatfield', goods: 'Chest freezer 300L', branch: 'MN Mbare North', service: 29, dims: true, m3: 1.4 },
  { inv: '414593', customer: 'D. Nyamande', suburb: 'Cranborne', goods: 'Rice 10kg × 30', branch: 'VE Willowvale', service: 33, dims: true, m3: 0.8 },
  { inv: '414601', customer: 'T. Mabaya', suburb: 'Waterfalls', goods: 'Bulk dry goods, loose', branch: 'MW Mbare Wholesale', service: 51, dims: false },
];

export const SEED_STOPS: Consignment[] = [
  { inv: '414414', customer: 'Nancy Muhoni', suburb: 'Greendale', goods: 'Chest freezer + cooking oil + maize meal', branch: 'VE Willowvale', service: 42, dims: true, m3: 1.6 },
  { inv: '414402', customer: 'W. Mhaka', suburb: 'Greendale', goods: 'Sugar 2kg bales × 30', branch: 'VE Willowvale', service: 26, dims: true, m3: 1.1 },
  { inv: '414388', customer: 'Tendai Zuze', suburb: 'Newlands', goods: 'Mixed grocery order, 40 lines', branch: 'BR Borrowdale', service: 47, dims: false },
  { inv: '414377', customer: 'C. Manyika', suburb: 'Eastlea', goods: 'Loose produce + bulk dry goods', branch: 'FS Fourth Street', service: 55, dims: false },
  { inv: '414365', customer: 'S. Kadenge', suburb: 'Msasa', goods: 'Cooking oil 2L, 15 cases', branch: 'MW Mbare Wholesale', service: 24, dims: true, m3: 0.6 },
  { inv: '414360', customer: 'F. Nyoni', suburb: 'Braeside', goods: 'Rice 10kg × 35', branch: 'VE Willowvale', service: 28, dims: true, m3: 0.7 },
  { inv: '414352', customer: 'M. Chidzero', suburb: 'Hillside', goods: 'Cleaning products, mixed', branch: 'MN Mbare North', service: 39, dims: false },
  { inv: '414344', customer: 'L. Muzenda', suburb: 'Cranborne', goods: 'Soft drinks, 25 crates', branch: 'VE Willowvale', service: 32, dims: true, m3: 0.8 },
  { inv: '414331', customer: 'D. Sithole', suburb: 'Waterfalls', goods: 'Mixed tuckshop order, 28 lines', branch: 'MW Mbare Wholesale', service: 26, dims: false },
];

export const SEED_TRIP_ID = 'TR-HRE-2026-08-20-05';
export const SEED_TRIP_ZONE = 'Zone C';
export const NEW_TRIP_ID = 'TR-HRE-2026-08-20-11';

/* ── Vehicles ─────────────────────────────────────────────────────────────
   ⚠⚠ Illustrative registrations and fleet numbers (prefix GC), from the shared
   map in ../GAIN-RESEED.md. Makes are plausible boxed trucks; nothing here is
   checked against a Gain fleet register, because none was available.
   The eligibility rule on this trip is "3.5t curtain-side or larger".
   ⚠ Cubic capacities and compliance dates are invented. AHC3301's insurance
   date carries the second caution the design calls for. */
export type Vehicle = {
  reg: string; fleetNo: string; make: string; cubeM3: number;
  note: string; state: 'refused' | 'caution' | 'ok';
};

export const VEHICLES: Vehicle[] = [
  { reg: 'AHB2107', fleetNo: 'GC87', make: 'UD Croner', cubeM3: 28.0, note: 'Certificate of Fitness expired 12 August — refused', state: 'refused' },
  { reg: 'AHB2114', fleetNo: 'GC58', make: 'Mitsubishi Fuso', cubeM3: 19.0, note: 'COF expires 31 August — available, flagged', state: 'caution' },
  { reg: 'AHC3301', fleetNo: 'GC74', make: 'Mitsubishi Canter', cubeM3: 16.0, note: 'Insurance expires 26 August — available, flagged', state: 'caution' },
  { reg: 'AHD4410', fleetNo: 'GC88', make: 'UD MKE', cubeM3: 34.0, note: 'Available · on trip 01 until 15:40', state: 'ok' },
  { reg: 'AHD4418', fleetNo: 'GC90', make: 'UD MKE', cubeM3: 34.0, note: 'Available · on trip 03 until 14:10', state: 'ok' },
  { reg: 'AHF5120', fleetNo: 'GC102', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AHF5121', fleetNo: 'GC103', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AHF5126', fleetNo: 'GC104', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AHF5130', fleetNo: 'GC105', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AHF5133', fleetNo: 'GC106', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AHG6012', fleetNo: 'GC107', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available · on trip 09', state: 'ok' },
  { reg: 'AHG6019', fleetNo: 'GC108', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
];

/* The vehicle the seeded trip opens against. AHF5121 is GC103, a UD Kuzer of
   22.0 m³ — so the capacity check on TM-2 divides by 22.0. Every fraction and its
   percentage on this screen agree with each other. */
export const SEED_VEHICLE = VEHICLES.find((v) => v.reg === 'AHF5121')!;

export const REFUSAL = {
  reg: 'AHB2107',
  title: 'AHB2107 cannot be assigned',
  reason: 'Certificate of fitness expired 12 August. A truck dispatched without valid papers is a truck impounded with a customer’s goods on it.',
  grant: 'Compliance Block Override',
};

/* ── TM-1: trips ──────────────────────────────────────────────────────────
   Load lines carry the fraction and the percentage together so they can never
   disagree; where there are unmeasured lines there is no percentage and no bar. */
export type TripCard = {
  id: string; zone: string; vehicle: string; status: string;
  stops?: number; service?: number; progress?: string; serviceText?: string;
  capText: string; capPct: number | null;
  statusColor: string; edge: string; current?: boolean;
};

export const BUILDING_STATIC: TripCard[] = [
  { id: 'TR-HRE-2026-08-20-04', zone: 'Zone C', vehicle: 'Unassigned', stops: 6, service: 187, status: 'Planned', capText: '3 lines with no dimensions', capPct: null, statusColor: N7, edge: 'transparent' },
  { id: 'TR-HRE-2026-08-20-06', zone: 'Zone D', vehicle: 'AHF5120 · GC102', stops: 7, service: 264, status: 'Planned', capText: '4 lines with no dimensions', capPct: null, statusColor: N7, edge: 'transparent' },
  { id: 'TR-HRE-2026-08-20-07', zone: 'Zone E', vehicle: 'Unassigned', stops: 5, service: 141, status: 'Draft', capText: '2 lines with no dimensions', capPct: null, statusColor: N6, edge: 'transparent' },
  // 9.40 of 22.0 = 42.7%. AHF5126 is GC104, a 22.0 m³ UD Kuzer.
  { id: 'TR-HRE-2026-08-20-08', zone: 'Zone F', vehicle: 'AHF5126 · GC104', stops: 8, service: 205, status: 'Planned', capText: '9.40 of 22.0 m³ — 43%', capPct: 43, statusColor: N7, edge: 'transparent' },
  // ⚠ 233 min / 9 stops is quoted in the footer teaching line (illustrative).
  { id: 'TR-HRE-2026-08-20-09', zone: 'Zone F', vehicle: 'AHG6012 · GC107', stops: 9, service: 233, status: 'Planned', capText: '7.07 of 22.0 m³ — 32%', capPct: 32, statusColor: N7, edge: 'transparent' },
];

export const RUNNING: TripCard[] = [
  // ⚠ 395 min / 11 stops — the other half of the footer teaching line.
  // Trip 01 is Zone C: TM-3 places AHD4410 at Msasa on the Mutare Road, which is
  // Greendale / East. The two screens agree.
  { id: 'TR-HRE-2026-08-20-01', zone: 'Zone C', vehicle: 'AHD4410 · GC88', progress: '5 of 11 done', serviceText: '395 min', status: 'In progress', capText: '7 lines with no dimensions', capPct: null, statusColor: AC, edge: AC },
  { id: 'TR-HRE-2026-08-20-02', zone: 'Zone B', vehicle: 'AHD4411 · GC89', progress: '3 of 10 done', serviceText: '319 min', status: 'In progress', capText: '2 lines with no dimensions', capPct: null, statusColor: AC, edge: AC },
  { id: 'TR-HRE-2026-08-20-03', zone: 'Zone B', vehicle: 'AHD4418 · GC90', progress: '0 of 8 done', serviceText: '247 min', status: 'Departed 07:06', capText: '4 lines with no dimensions', capPct: null, statusColor: TX, edge: TX },
  { id: 'TR-HRE-2026-08-20-10', zone: 'Zone G', vehicle: 'AHX2205 · Kopje Haulage', progress: '4 stops', serviceText: 'hired carrier', status: 'Awaiting proof', capText: 'not reported by carrier', capPct: null, statusColor: N7, edge: N4 },
];

export const BOARD_FOOTER_PROSE =
  'Most trips cannot show a fill percentage: their lines have no pack sizes in the item master. The board says so rather than guessing.';
export const BOARD_FOOTER_FIGURES = '395 min / 11 stops  ·  233 min / 9 stops — mixed tuckshop orders against full cases';

/* ── TM-3: live trips ─────────────────────────────────────────────────────
   ⚠⚠ Every timestamp names its source, and trip 02 has no position and no ETA.
   A last-known dot on a map is a lie the moment it is more than a few minutes
   old; the honest answer is the empty cell and the reason for it. */
export type LiveTrip = {
  id: string; vehicle: string; driver: string; stops: string;
  position: string; posSource: string; posColor: string;
  eta: string; etaNote: string;
};

export const LIVE_TRIPS: LiveTrip[] = [
  { id: 'TR-HRE-2026-08-20-01', vehicle: 'AHD4410', driver: 'B. Chimbetu', stops: '5 / 11', position: 'Msasa, Mutare Road', posSource: 'fix 07:14 · Cartrack', posColor: TX, eta: '15:40', etaNote: 'from 6 remaining stops' },
  { id: 'TR-HRE-2026-08-20-02', vehicle: 'AHD4411', driver: 'S. Chagonda', stops: '3 / 10', position: 'Position unavailable', posSource: 'last fix 06:41 — stale, not shown', posColor: AC7, eta: '—', etaNote: 'no ETA without a fix' },
  { id: 'TR-HRE-2026-08-20-03', vehicle: 'AHD4418', driver: 'T. Mukanya', stops: '0 / 8', position: 'Depot gate, Willowvale', posSource: 'departed 07:06 · by geofence', posColor: TX, eta: '14:10', etaNote: 'planned, not yet driving' },
  { id: 'TR-HRE-2026-08-20-10', vehicle: 'AHX2205', driver: 'Kopje Haulage', stops: '—', position: 'Not tracked', posSource: 'hired carrier · no telemetry', posColor: N7, eta: '—', etaNote: 'proof on return' },
];

/* ⚠ Only the two vehicles with a current fix are on the map. AHD4411 is absent
   on purpose — see LIVE_TRIPS above. */
export const LIVE_VEHICLES = [
  { label: 'AHD4410', lat: -17.846, lng: 31.123 },
  { label: 'AHD4418', lat: -17.874, lng: 31.006 },
];

/* ── TM-3: exceptions ─────────────────────────────────────────────────────
   Copy is verbatim from the handoff, with the seeded day's serial
   #G-000004652985 and the rebook owner EC Ecommerce. The fault column reads Gain
   where the business, not the customer, is at fault. ⚠ The dispatch tablet quotes
   EXCEPTIONS[0] field for field — change it there too. */
export type ExceptionRow = {
  ref: string; title: string; detail: string; raised: string; by: string;
  fault: string; status: string; statusColor: string; expanded: string;
};

export const EXCEPTIONS: ExceptionRow[] = [
  {
    ref: 'EX-000029114',
    title: 'Serial mismatch — blocked at the load',
    detail: 'Sold on invoice 410233, 21 June, dispatched to Kwekwe.',
    raised: '07:31', by: 'T. Mukanya', fault: 'Gain', status: 'Open', statusColor: AC7,
    expanded: 'Serial #G-000004652985 scanned onto trip 03; the trail says it left Kwekwe on 24 June. The load is held. Override requires the Serial Mismatch Override grant.',
  },
  {
    ref: 'EX-000029118',
    title: 'Delivery failed — customer not home',
    detail: 'Attempt 1 · Chitungwiza · driver waited 12 minutes.',
    raised: '11:48', by: 'S. Chagonda', fault: 'Customer',
    status: 'Awaiting rebook by EC · due 09:00 tomorrow', statusColor: N7,
    expanded: 'Rebook is owned by the branch that sold it — EC Ecommerce — not by transport. Goods returned to the depot and are in custody under seal 44102.',
  },
  {
    ref: 'EX-000029121',
    title: '6 deliveries signed, photographs waiting for depot wifi',
    detail: 'Outcomes, signatures and cash already arrived. 41 images queued.',
    raised: '15:10', by: '—', fault: '—', status: 'Open', statusColor: N7,
    expanded: 'Not a failure. PROOF_MEDIA drains on wifi only; the proof itself posted at 15:10. This row closes itself when the truck reaches the depot.',
  },
];

export const EXCEPTIONS_FOOT =
  'Proof waiting for wifi is a visible state, not a silent one. Forty photographs on a mobile connection is normal.';

/* ── TM-4: the trace record ───────────────────────────────────────────────
   ⚠ Illustrative. Invoice 414414's reference and fiscal signature are invented
   for the Gain demo (the earlier build quoted a real TVSH invoice — removed). The
   driver app and the dispatch tablet hold the same identities. */
export const RECORD = [
  { label: 'Invoice', value: '414414 · VE01/0048112 · fiscal A7C2-5E19-0B4D-91F3 · device 6120' },
  { label: 'Branch', value: 'VE Gain Cash & Carry Willowvale' },
  { label: 'Customer', value: 'Nancy Muhoni · +263 773 637 984' },
  { label: 'Address', value: 'Unit 7 Stand 312 St Malo, Greendale · pin confirmed by driver' },
  { label: 'Goods', value: 'Chest freezer Defy 300L CF300   serial #G-000004791204\nCooking oil 2L × 6, case   × 10\nMaize meal 10kg, bag   × 20' },
  { label: 'Scanned out', value: '20 Aug 2026 07:12 · Willowvale · scanned, not typed' },
  { label: 'Trip', value: 'TR-HRE-2026-08-20-05 · AHF5121 (GC103)' },
  { label: 'Driver', value: 'T. Mukanya · crew W. Sibindi' },
  { label: 'Departed', value: '06:52 · by geofence' },
  { label: 'Arrived', value: '14:07 · by geofence' },
  { label: 'Delivered', value: '3 of 3 · condition good · functional test passed' },
  { label: 'Signed', value: 'L. Mavuto · ID 63-1188774-B-42' },
  /* ⚠⚠ The money the driver took at the door, on the same record as the goods.
     Beat 9 of the running order is the driver taking cash with no signal, and
     this row is where that beat lands at beat 13. The receipt number was minted
     on the device (PAY-<store>-<terminal>-<sequence>, terminal inside the
     number) and is the idempotency key — so it is the same identity offline and
     in the ledger, which is the argument.
     ⚠ The deposit branch is deliberately not the selling branch: the money is
     recorded against where it actually went, so reconciliation is a query.
     TRP-004 §6.1–6.4. */
  { label: 'Payment', value: 'USD 1 150.00 cash at the door · receipt PAY-101-D204-000037\ntaken 14:11 offline · in the ledger 18:14 on depot wifi · deposited BR Borrowdale' },
  { label: 'Charge', value: 'USD 21.65' },
  { label: 'Posted', value: 'goods issue · delivery completion' },
];

/* ⚠⚠ Labelled placeholders, not images. Real ones come from the driver app's
   proof capture, which is not built. Do not fake a photograph of a customer's
   identity document to make a slide look finished. */
/* ⚠⚠ Re-sequenced 20 Aug when the driver app was built, and the order matters.
   These rows used to read Signature 14:11 · ID 14:12 · Goods 14:14 — the
   receiver signing three minutes BEFORE the goods were photographed, which
   reverses the driver app's own rule: three pieces of evidence, then the
   signature, and the line set locks at the signature (TRP-004 §3.2 step 6).
   The driver app captures at 14:09, 14:10 and 14:11; these are the same three
   moments, in the same order, and the signature still lands on 14:11 beside the
   cash. ⚠ Changing them here means changing XPOS/vantage-driver-app/lib/run.ts
   (CAPTURED) as well. Wyne's call, 20 Aug. */
export const EVIDENCE = [
  { kind: 'Goods in place', meta: '14:09 · 1.6 MB · uploaded' },
  { kind: 'ID photograph', meta: '14:10 · 1.2 MB · uploaded' },
  { kind: 'Signature', meta: '14:11 · 84 KB · on device' },
];

/* ⚠ The receipt number resolves too, though it is not one of the four chips. If
   a director in the room reads the receipt off the driver's phone and types it
   in here, it must find the same record — that is the whole claim of the screen,
   and it would be a poor moment to discover it only accepts the four we chose. */
export const SEARCH_KEYS = [
  '414414', 'g-000004791204', '000004791204', 'ahf5121', 'nancy muhoni', 'nancy', 'muhoni', 'gc103',
  'pay-101-d204-000037', '000037',
];
export const SEARCH_CHIPS = ['414414', 'G-000004791204', 'AHF5121', 'Nancy Muhoni'];

export const SEARCH_EMPTY =
  'One field. One number. On paper, the invoice, the delivery note, the gate pass and the trip sheet each carry their own number and share no key — a person in an office reconciles them by hand.';
export const SEARCH_CLOSE =
  'Scanned out, bound to a serial, carried on a named trip, signed for by a named person with an ID number, and posted. One identity all the way down.';

/* ── TM-5: fleet cost ─────────────────────────────────────────────────────
   ⚠⚠ ILLUSTRATIVE July 2026 figures for the Gain demo (../GAIN-RESEED.md). The
   earlier build carried TVSH's real April 2026 Transport Report here; none of it
   remains. The figures are internally consistent, and that is all. */
export const COST_MONTH = 'July 2026';
export const COST_ROWS = [
  { label: 'Active vehicles', value: '38', extra: '', indent: 0, muted: false },
  { label: 'Distance, July', value: '64,210 km', extra: '', indent: 0, muted: false },
  { label: 'Cost per km, excl. 3PL', value: '$1.184', extra: '', indent: 0, muted: false },
  { label: 'Cost per km, incl. 3PL', value: '$1.392', extra: '', indent: 0, muted: false },
  { label: 'fuel', value: '$0.341 /km', extra: '$21,896', indent: 16, muted: true },
  { label: 'repairs & maintenance', value: '$0.098 /km', extra: '$6,293', indent: 16, muted: true },
  { label: 'Third-party carriers', value: '$13,355', extra: '5 carriers', indent: 0, muted: false },
  { label: 'Fuel efficiency', value: '6.12 km/l', extra: 'std 6.30', indent: 0, muted: false },
  { label: 'Deliveries, July', value: '2,418', extra: '+11.2%', indent: 0, muted: false },
  { label: 'Revenue per delivery', value: '$24.60', extra: '', indent: 0, muted: false },
];

/* ⚠ Illustrative. A real per-vehicle variance needs fuel captured against a
   registration and an odometer at every fill — which is what the driver app's
   debrief captures. AHB2107's −9.9% is the figure the closing callout rests on. */
export const VARIANCE = [
  { reg: 'AHB2107', pct: '−9.9%', v: -9.9 },
  { reg: 'AHA1190', pct: '−4.1%', v: -4.1 },
  { reg: 'AHF5126', pct: '−2.6%', v: -2.6 },
  { reg: 'AHD4410', pct: '−0.8%', v: -0.8 },
  { reg: 'AHF5121', pct: '+0.4%', v: 0.4 },
  { reg: 'AHF5133', pct: '+1.2%', v: 1.2 },
  { reg: 'AHD4418', pct: '+2.0%', v: 2.0 },
  { reg: 'AHF5120', pct: '+3.3%', v: 3.3 },
  { reg: 'AHG6019', pct: '+4.6%', v: 4.6 },
];

export const COST_NOTE_YTD = { month: '$13,355', ytd: '$131,920', carriers: 5 };
export const COST_CALLOUT =
  'burns 9.9% more than target and its certificate of fitness expired on 12 August. It is off the road on both counts — this is the vehicle the screen exists to find.';

/* ── The demo running order ───────────────────────────────────────────────
   ⚠ Scaffolding. Beats 4–10 are the mobile build and render dimmed; they have no
   screen in this repo and clicking them must not pretend otherwise. */
export type Beat = { n: number; screen: string; route: string | null; line: string };

export const BEATS: Beat[] = [
  { n: 1, screen: 'TM-1', route: '/transport/board', line: 'This is Thursday morning. Forty-three deliveries promised, nothing on a truck yet.' },
  { n: 2, screen: 'TM-1', route: '/transport/board', line: 'Most of these trucks cannot tell you how full they are, because nobody has entered the pack sizes. It says so, rather than guessing.' },
  { n: 3, screen: 'TM-2', route: '/transport/trips/build', line: 'Build the trip, preview the route — and this vehicle is refused. Certificate of fitness expired eight days ago.' },
  { n: 4, screen: 'SD-1', route: null, line: 'Now the cash-and-carry. A third of this is trade customers coming to collect. (mobile build)' },
  { n: 5, screen: 'SD-2', route: null, line: 'Scanning goods out. And this freezer was sold in June and sent to Kwekwe — it stops. (mobile build)' },
  { n: 6, screen: 'SD-3', route: null, line: 'Same control with no truck at all. (mobile build)' },
  { n: 7, screen: 'DR-2', route: null, line: 'The driver accepts what the store scanned. Two people, one serial. (mobile build)' },
  { n: 8, screen: 'DR-1/3', route: null, line: 'His day. And at the door — he switches the freezer on before anyone signs. (mobile build)' },
  { n: 9, screen: 'DR-4', route: null, line: 'He also takes cash, with no signal. Notice what it does not say. (mobile build)' },
  { n: 10, screen: 'DR-5', route: null, line: 'Nobody home. The rebook goes to the branch that sold it, by nine tomorrow. (mobile build)' },
  { n: 11, screen: 'TM-3', route: '/transport/live', line: 'Everything that went wrong today, oldest first.' },
  { n: 12, screen: 'TM-5', route: '/transport/fleet/cost', line: 'And what the fleet costs.' },
  { n: 13, screen: 'TM-4', route: '/transport/search', line: 'One number.' },
];

export const RAIL = [
  { href: '/transport/board', title: 'The board', sub: 'TM-1 · unplanned work' },
  { href: '/transport/trips/build', title: 'Build a trip', sub: 'TM-2 · plan & route' },
  { href: '/transport/live', title: 'Live & exceptions', sub: 'TM-3 · 3 open' },
  { href: '/transport/search', title: 'Search', sub: 'TM-4 · one number' },
  { href: '/transport/fleet/cost', title: 'Fleet cost', sub: 'TM-5 · July 2026' },
];
