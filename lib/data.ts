/* Seed data for the Vantage Transport Management demo console.
 *
 * ⚠⚠ THIS FILE HAS BEEN THROUGH THE DATA-TRUTH PASS (build step B3).
 *
 * The design prototype's arrays carried real registrations but partly invented
 * fleet numbers and makes, and used Harare *suburbs* as branch names. A fleet
 * manager recognises his own trucks and an operations head recognises his own
 * branches; that recognition is the difference between "they built this from our
 * data" and "they made this up". Every identity below has been checked against
 * Transport-Material/demo/transport-demo-data.json (which is itself checked
 * against TVSH's Fleet Register and the April 2026 Transport Report).
 *
 * ⚠ What is real here: branch codes and names, zone map and nominated days,
 *   vehicle registrations, fleet numbers, makes and models, body types, Harare
 *   suburbs, invoice 414414 and its fiscal signature, and every aggregate figure
 *   on TM-5.
 * ⚠ What is invented, and openly so: driver and crew names, customer names and
 *   addresses, vehicle cubic capacities, compliance expiry dates, per-vehicle
 *   fuel variance, and the individual consignments of this day. TVSH holds no
 *   cube data and no compliance expiry dates — that absence is the subject of
 *   the load line, not a gap to paper over.
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
   Real, from the July 2026 discovery workshop. The prototype's zone letters
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
/* ⚠ Newlands, Eastlea and Hillside are not in TVSH's published zone table. They
   are filed against the nearest zone rather than shown blank, because a blank
   zone on the board would read as a defect. If TVSH confirms a different
   allocation, this map is the one line to change. */
export const zoneOf = (suburb: string) => ZONE_OF[suburb] || 'C';

/* ── Branch sync strip ────────────────────────────────────────────────────
   ⚠⚠ Real branch codes and names. The prototype used Bradfield, Kuwadzana,
   Hatfield and Highfield — those are suburbs, not branches. Marondera (MD) is
   the one behind, and it is deliberately absent from the selling branches on the
   board below: its deliveries genuinely are not on this board, which is what the
   strip says out loud. */
export type Branch = { code: string; name: string; stamp: string; live: boolean };
export const BRANCHES: Branch[] = [
  { code: 'VE', name: 'Village Walk', stamp: 'live', live: true },
  { code: 'BR', name: 'Borrowdale', stamp: 'live', live: true },
  { code: 'MN', name: 'Mbuya Nehanda', stamp: 'live', live: true },
  { code: 'MW', name: 'Mega Watt', stamp: 'live', live: true },
  { code: 'FS', name: 'First Street', stamp: 'live', live: true },
  { code: 'AV', name: 'Avondale', stamp: 'live', live: true },
  { code: 'MD', name: 'Marondera', stamp: 'last synced 14:32', live: false },
];
export const SYNC_NOTE = '1 branch behind — its deliveries are not on this board';

/* ── TM-1: the unplanned column ───────────────────────────────────────────
   43 unplanned today; nine are shown and the rest are counted. Branch codes are
   real; zones are derived from the suburb. */
export type Consignment = {
  inv: string; customer: string; suburb: string; goods: string;
  branch: string; service: number; dims?: boolean; m3?: number;
};

export const UNPLANNED: Consignment[] = [
  { inv: '414512', customer: 'T. Chikwanha', suburb: 'Waterfalls', goods: 'Defy 4-plate stove', branch: 'VE Village Walk', service: 22 },
  { inv: '414518', customer: 'Grace Ndoro', suburb: 'Mabvuku', goods: '3-piece lounge suite', branch: 'BR Borrowdale', service: 55 },
  { inv: '414523', customer: 'M. Nyahuye', suburb: 'Borrowdale', goods: 'Samsung 65" QLED + bracket', branch: 'VE Village Walk', service: 35 },
  { inv: '414529', customer: 'Precious Zhou', suburb: 'Chitungwiza', goods: 'Queen bed + 2 pedestals', branch: 'MW Mega Watt', service: 48 },
  { inv: '414534', customer: 'K. Mutasa', suburb: 'Greendale', goods: 'Hisense 205l fridge', branch: 'VE Village Walk', service: 26 },
  { inv: '414541', customer: 'S. Dube', suburb: 'Kuwadzana', goods: 'Washing machine 7kg', branch: 'FS First Street', service: 24 },
  { inv: '414547', customer: 'Loveness Banda', suburb: 'Avondale', goods: 'Dining suite, 6 seat', branch: 'AV Avondale', service: 52 },
  { inv: '414550', customer: 'B. Marufu', suburb: 'Hatfield', goods: 'Deep freezer 300l', branch: 'MN Mbuya Nehanda', service: 28 },
  { inv: '414556', customer: 'J. Sibanda', suburb: 'Highfield', goods: 'Sony home theatre 5.1', branch: 'MW Mega Watt', service: 19 },
];

export const UNPLANNED_TOTAL = 43;               // ⚠ real: dayShape.unplanned
export const UNPLANNED_MORE = '34 more · 8 promised before noon';

/* ── TM-2: the pool and the seeded trip ───────────────────────────────────
   `dims:false` is the ordinary case, not the exception: TVSH holds no cube data
   for furniture, so nine lines in ten cannot be measured. */
export const POOL_ALL: Consignment[] = [
  { inv: '414534', customer: 'K. Mutasa', suburb: 'Greendale', goods: 'Hisense 205l fridge', branch: 'VE Village Walk', service: 26, dims: false },
  { inv: '414547', customer: 'Loveness Banda', suburb: 'Avondale', goods: 'Dining suite, 6 seat', branch: 'AV Avondale', service: 52, dims: false },
  { inv: '414561', customer: 'E. Chirwa', suburb: 'Newlands', goods: 'Double bed, headboard', branch: 'BR Borrowdale', service: 44, dims: false },
  { inv: '414565', customer: 'P. Moyo', suburb: 'Msasa', goods: 'Microwave + kettle', branch: 'MW Mega Watt', service: 14, dims: true, m3: 0.4 },
  { inv: '414571', customer: 'N. Gwatidzo', suburb: 'Eastlea', goods: 'Lounge suite, 2 seat', branch: 'FS First Street', service: 38, dims: false },
  { inv: '414574', customer: 'R. Tsvangirai', suburb: 'Braeside', goods: 'TV stand + 43" LED', branch: 'VE Village Walk', service: 21, dims: true, m3: 0.9 },
  { inv: '414580', customer: 'A. Chigumbu', suburb: 'Hillside', goods: 'Wardrobe, 3 door', branch: 'MN Mbuya Nehanda', service: 46, dims: false },
  { inv: '414588', customer: 'M. Sibanda', suburb: 'Hatfield', goods: 'Chest freezer 300l', branch: 'MN Mbuya Nehanda', service: 29, dims: true, m3: 1.4 },
  { inv: '414593', customer: 'D. Nyamande', suburb: 'Cranborne', goods: '55" QLED + soundbar', branch: 'VE Village Walk', service: 33, dims: true, m3: 0.8 },
  { inv: '414601', customer: 'T. Mabaya', suburb: 'Waterfalls', goods: 'Bunk bed + mattresses', branch: 'MW Mega Watt', service: 51, dims: false },
];

export const SEED_STOPS: Consignment[] = [
  { inv: '414414', customer: 'Nancy Muhoni', suburb: 'Greendale', goods: '85" QLED + home theatre', branch: 'VE Village Walk', service: 42, dims: true, m3: 1.6 },
  { inv: '414402', customer: 'W. Mhaka', suburb: 'Greendale', goods: 'Chest freezer 210l', branch: 'VE Village Walk', service: 26, dims: true, m3: 1.1 },
  { inv: '414388', customer: 'Tendai Zuze', suburb: 'Newlands', goods: 'Queen bed + base', branch: 'BR Borrowdale', service: 47, dims: false },
  { inv: '414377', customer: 'C. Manyika', suburb: 'Eastlea', goods: 'Lounge suite, 3 piece', branch: 'FS First Street', service: 55, dims: false },
  { inv: '414365', customer: 'S. Kadenge', suburb: 'Msasa', goods: 'Stove + gas cylinder', branch: 'MW Mega Watt', service: 24, dims: true, m3: 0.6 },
  { inv: '414360', customer: 'F. Nyoni', suburb: 'Braeside', goods: 'Washing machine 8kg', branch: 'VE Village Walk', service: 28, dims: true, m3: 0.7 },
  { inv: '414352', customer: 'M. Chidzero', suburb: 'Hillside', goods: 'Dining suite, 4 seat', branch: 'MN Mbuya Nehanda', service: 39, dims: false },
  { inv: '414344', customer: 'L. Muzenda', suburb: 'Cranborne', goods: '55" LED + bracket', branch: 'VE Village Walk', service: 32, dims: true, m3: 0.8 },
  { inv: '414331', customer: 'D. Sithole', suburb: 'Waterfalls', goods: 'Wardrobe, 2 door', branch: 'MW Mega Watt', service: 26, dims: false },
];

export const SEED_TRIP_ID = 'TR-HRE-2026-08-20-05';
export const SEED_TRIP_ZONE = 'Zone C';
export const NEW_TRIP_ID = 'TR-HRE-2026-08-20-11';

/* ── Vehicles ─────────────────────────────────────────────────────────────
   ⚠⚠ Every registration, fleet number, make and model below is from the Fleet
   Register. The prototype had TVS61/Isuzu FRR, TVS72/Hino 500, TVS94/Isuzu NQR
   and TVS103/Isuzu NPR — four of five were wrong. TVSH runs UD, Mitsubishi,
   Suzuki and Hyundai; it runs no Isuzu and no Hino.
   The picker lists the Harare boxed trucks, because the eligibility rule on this
   trip is "3.5t curtain-side or larger" — the flatbeds and the two Suzuki Super
   Carrys cannot take enclosed furniture.
   ⚠ Cubic capacities and compliance dates are invented; TVSH records neither.
   AFC1778's insurance date carries the second caution the design calls for. */
export type Vehicle = {
  reg: string; fleetNo: string; make: string; cubeM3: number;
  note: string; state: 'refused' | 'caution' | 'ok';
};

export const VEHICLES: Vehicle[] = [
  { reg: 'AFR5403', fleetNo: 'TVS87', make: 'UD Croner', cubeM3: 28.0, note: 'Certificate of Fitness expired 12 August — refused', state: 'refused' },
  { reg: 'AEF0349', fleetNo: 'TVS58', make: 'Mitsubishi Fuso', cubeM3: 19.0, note: 'COF expires 31 August — available, flagged', state: 'caution' },
  { reg: 'AFC1778', fleetNo: 'TVS74', make: 'Mitsubishi Canter', cubeM3: 16.0, note: 'Insurance expires 26 August — available, flagged', state: 'caution' },
  { reg: 'AFG6940', fleetNo: 'TVS88', make: 'UD MKE', cubeM3: 34.0, note: 'Available · on trip 01 until 15:40', state: 'ok' },
  { reg: 'AFK1578', fleetNo: 'TVS90', make: 'UD MKE', cubeM3: 34.0, note: 'Available · on trip 03 until 14:10', state: 'ok' },
  { reg: 'AGE5598', fleetNo: 'TVS102', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AGE5599', fleetNo: 'TVS103', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AGE5641', fleetNo: 'TVS104', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AGE5557', fleetNo: 'TVS105', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AGH8421', fleetNo: 'TVS106', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
  { reg: 'AGH-8544', fleetNo: 'TVS107', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available · on trip 09', state: 'ok' },
  { reg: 'AGH-8060', fleetNo: 'TVS108', make: 'UD Kuzer', cubeM3: 22.0, note: 'Available', state: 'ok' },
];

/* The vehicle the seeded trip opens against. AGE5599 is TVS103, a UD Kuzer of
   22.0 m³ — so the capacity check on TM-2 divides by 22.0, not the prototype's
   16.0. Every fraction and its percentage on this screen agree with each other. */
export const SEED_VEHICLE = VEHICLES.find((v) => v.reg === 'AGE5599')!;

export const REFUSAL = {
  reg: 'AFR5403',
  title: 'AFR5403 cannot be assigned',
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
  { id: 'TR-HRE-2026-08-20-06', zone: 'Zone D', vehicle: 'AGE5598 · TVS102', stops: 7, service: 264, status: 'Planned', capText: '4 lines with no dimensions', capPct: null, statusColor: N7, edge: 'transparent' },
  { id: 'TR-HRE-2026-08-20-07', zone: 'Zone E', vehicle: 'Unassigned', stops: 5, service: 141, status: 'Draft', capText: '2 lines with no dimensions', capPct: null, statusColor: N6, edge: 'transparent' },
  // 9.40 of 22.0 = 42.7%. AGE5641 is TVS104, a 22.0 m³ UD Kuzer — the prototype
  // divided by 18.0 and printed 52%. The cube changed; the percentage follows it.
  { id: 'TR-HRE-2026-08-20-08', zone: 'Zone F', vehicle: 'AGE5641 · TVS104', stops: 8, service: 205, status: 'Planned', capText: '9.40 of 22.0 m³ — 43%', capPct: 43, statusColor: N7, edge: 'transparent' },
  // ⚠ 233 min / 9 stops is a real figure from the April 2026 Transport Report and
  //   is quoted in the footer teaching line. Do not adjust it.
  { id: 'TR-HRE-2026-08-20-09', zone: 'Zone F', vehicle: 'AGH-8544 · TVS107', stops: 9, service: 233, status: 'Planned', capText: '7.07 of 22.0 m³ — 32%', capPct: 32, statusColor: N7, edge: 'transparent' },
];

export const RUNNING: TripCard[] = [
  // ⚠ 395 min / 11 stops — the other half of the footer teaching line.
  // Trip 01 is Zone C, not the prototype's Zone A: TM-3 places AFG6940 at Msasa
  // on the Mutare Road, which is Greendale / East. The two screens now agree.
  { id: 'TR-HRE-2026-08-20-01', zone: 'Zone C', vehicle: 'AFG6940 · TVS88', progress: '5 of 11 done', serviceText: '395 min', status: 'In progress', capText: '7 lines with no dimensions', capPct: null, statusColor: AC, edge: AC },
  { id: 'TR-HRE-2026-08-20-02', zone: 'Zone B', vehicle: 'AFG6941 · TVS89', progress: '3 of 10 done', serviceText: '319 min', status: 'In progress', capText: '2 lines with no dimensions', capPct: null, statusColor: AC, edge: AC },
  { id: 'TR-HRE-2026-08-20-03', zone: 'Zone B', vehicle: 'AFK1578 · TVS90', progress: '0 of 8 done', serviceText: '247 min', status: 'Departed 07:06', capText: '4 lines with no dimensions', capPct: null, statusColor: TX, edge: TX },
  { id: 'TR-HRE-2026-08-20-10', zone: 'Zone G', vehicle: 'ACL 4471 · Cheetah Express', progress: '4 stops', serviceText: 'hired carrier', status: 'Awaiting proof', capText: 'not reported by carrier', capPct: null, statusColor: N7, edge: N4 },
];

export const BOARD_FOOTER_PROSE =
  'Nine trips in ten cannot show a fill percentage: furniture has no measured dimensions. The board says so rather than guessing.';
export const BOARD_FOOTER_FIGURES = '395 min / 11 stops  ·  233 min / 9 stops — beds against appliances';

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
  { id: 'TR-HRE-2026-08-20-01', vehicle: 'AFG6940', driver: 'B. Chimbetu', stops: '5 / 11', position: 'Msasa, Mutare Road', posSource: 'fix 07:14 · Cartrack', posColor: TX, eta: '15:40', etaNote: 'from 6 remaining stops' },
  { id: 'TR-HRE-2026-08-20-02', vehicle: 'AFG6941', driver: 'S. Chagonda', stops: '3 / 10', position: 'Position unavailable', posSource: 'last fix 06:41 — stale, not shown', posColor: AC7, eta: '—', etaNote: 'no ETA without a fix' },
  { id: 'TR-HRE-2026-08-20-03', vehicle: 'AFK1578', driver: 'T. Mukanya', stops: '0 / 8', position: 'Depot gate, Willowvale', posSource: 'departed 07:06 · by geofence', posColor: TX, eta: '14:10', etaNote: 'planned, not yet driving' },
  { id: 'TR-HRE-2026-08-20-10', vehicle: 'ACL 4471', driver: 'Cheetah Express', stops: '—', position: 'Not tracked', posSource: 'hired carrier · no telemetry', posColor: N7, eta: '—', etaNote: 'proof on return' },
];

/* ⚠ Only the two vehicles with a current fix are on the map. AFG6941 is absent
   on purpose — see LIVE_TRIPS above. */
export const LIVE_VEHICLES = [
  { label: 'AFG6940', lat: -17.846, lng: 31.123 },
  { label: 'AFK1578', lat: -17.874, lng: 31.006 },
];

/* ── TM-3: exceptions ─────────────────────────────────────────────────────
   Copy is verbatim from the handoff except for two corrected identities:
   ⚠ the serial is #G-000004652985 (the seeded day's serial; the prototype quoted
     #G-000003318877, which belongs to no consignment), and
   ⚠ the rebook owner is EC Ecommerce — EC is a real branch code and Chitungwiza
     is a suburb, not a branch. The suburb still appears in the detail line, where
     it belongs. */
export type ExceptionRow = {
  ref: string; title: string; detail: string; raised: string; by: string;
  fault: string; status: string; statusColor: string; expanded: string;
};

export const EXCEPTIONS: ExceptionRow[] = [
  {
    ref: 'EX-000029114',
    title: 'Serial mismatch — blocked at the load',
    detail: 'Sold on invoice 410233, 21 June, dispatched to Kwekwe.',
    raised: '07:31', by: 'T. Mukanya', fault: 'TVSH', status: 'Open', statusColor: AC7,
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
   ⚠ Invoice 414414 and its fiscal signature are real. The trip and vehicle
   identities have been corrected: AGE5599 is TVS103, a UD Kuzer. */
export const RECORD = [
  { label: 'Invoice', value: '414414 · VE01/0033736 · fiscal D498-C19F-E480-D38A · device 7874' },
  { label: 'Branch', value: 'VE Village Walk Electrical' },
  { label: 'Customer', value: 'Nancy Muhoni · +263 773 637 984' },
  { label: 'Address', value: 'Unit 7 Stand 312 St Malo, Greendale · pin confirmed by driver' },
  { label: 'Goods', value: 'CTV Samsung 85" QA85Q7FAAUXKE   serial #G-000004791204\nTV Bracket Ellis 60-120"\nSony 600W Home Theatre 5.1Ch HT-S40R' },
  { label: 'Scanned out', value: '20 Aug 2026 07:12 · Village Walk · scanned, not typed' },
  { label: 'Trip', value: 'TR-HRE-2026-08-20-05 · AGE5599 (TVS103)' },
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
     TVSH-SDD-TRP-004 §6.1–6.4. */
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
  '414414', 'g-000004791204', '000004791204', 'age5599', 'nancy muhoni', 'nancy', 'muhoni', 'tvs103',
  'pay-101-d204-000037', '000037',
];
export const SEARCH_CHIPS = ['414414', 'G-000004791204', 'AGE5599', 'Nancy Muhoni'];

export const SEARCH_EMPTY =
  'One field. One number. Today the invoice, the Issue Distribution Order, the Confirmation Note and the Driver Allocation Book each carry their own number and share no key — a person in an office reconciles them by hand.';
export const SEARCH_CLOSE =
  'Scanned out, bound to a serial, carried on a named trip, signed for by a named person with an ID number, and posted. One identity all the way down.';

/* ── TM-5: fleet cost ─────────────────────────────────────────────────────
   ⚠⚠ Every figure in this table is real, from TVSH's April 2026 Transport
   Report. They are the numbers a finance director will recognise. Do not round,
   re-derive or "tidy" any of them. */
export const COST_ROWS = [
  { label: 'Active vehicles', value: '60', extra: '', indent: 0, muted: false },
  { label: 'Distance, April', value: '117,169 km', extra: '', indent: 0, muted: false },
  { label: 'Cost per km, excl. 3PL', value: '$1.212', extra: '', indent: 0, muted: false },
  { label: 'Cost per km, incl. 3PL', value: '$1.540', extra: '', indent: 0, muted: false },
  { label: 'fuel', value: '$0.350 /km', extra: '$41,018', indent: 16, muted: true },
  { label: 'repairs & maintenance', value: '$0.112 /km', extra: '$13,088', indent: 16, muted: true },
  { label: 'Third-party carriers', value: '$38,371', extra: '8 carriers', indent: 0, muted: false },
  { label: 'Fuel efficiency', value: '6.59 km/l', extra: 'std 6.64', indent: 0, muted: false },
  { label: 'Deliveries, April', value: '3,179', extra: '+20.5%', indent: 0, muted: false },
  { label: 'Revenue per delivery', value: '$18.71', extra: '', indent: 0, muted: false },
];

/* ⚠ Every registration here is real. The per-vehicle variance is not: TVSH's
   fuel data supports a fleet-wide figure (6.59 actual against a 6.64 standard,
   −0.05) but not a reliable per-vehicle split. AFR5403's −9.9% is the figure the
   closing callout rests on and is kept as drawn. If TVSH later produces a real
   per-vehicle breakdown, this array is what it replaces. */
export const VARIANCE = [
  { reg: 'AFR5403', pct: '−9.9%', v: -9.9 },
  { reg: 'AEK6847', pct: '−4.1%', v: -4.1 },
  { reg: 'AGE5641', pct: '−2.6%', v: -2.6 },
  { reg: 'AFG6940', pct: '−0.8%', v: -0.8 },
  { reg: 'AGE5599', pct: '+0.4%', v: 0.4 },
  { reg: 'AGH8421', pct: '+1.2%', v: 1.2 },
  { reg: 'AFK1578', pct: '+2.0%', v: 2.0 },
  { reg: 'AGE5598', pct: '+3.3%', v: 3.3 },
  { reg: 'AGH-8060', pct: '+4.6%', v: 4.6 },
];

export const COST_NOTE_YTD = { april: '$38,371', ytd: '$434,319', carriers: 8 };
export const COST_CALLOUT =
  'burns 9.9% more than target and its certificate of fitness expired on 12 August. It is off the road on both counts — this is the vehicle the screen exists to find.';

/* ── The demo running order ───────────────────────────────────────────────
   ⚠ Scaffolding. Beats 4–10 are the mobile build and render dimmed; they have no
   screen in this repo and clicking them must not pretend otherwise. */
export type Beat = { n: number; screen: string; route: string | null; line: string };

export const BEATS: Beat[] = [
  { n: 1, screen: 'TM-1', route: '/transport/board', line: 'This is Thursday morning. Forty-three deliveries promised, nothing on a truck yet.' },
  { n: 2, screen: 'TM-1', route: '/transport/board', line: 'Nine of these ten trucks cannot tell you how full they are, because nobody has measured a bed. It says so, rather than guessing.' },
  { n: 3, screen: 'TM-2', route: '/transport/trips/build', line: 'Build the trip, preview the route — and this vehicle is refused. Certificate of fitness expired eight days ago.' },
  { n: 4, screen: 'SD-1', route: null, line: 'Now the store. A third of this is customers coming to collect. (mobile build)' },
  { n: 5, screen: 'SD-2', route: null, line: 'Scanning goods out. And this freezer was sold in June and sent to Kwekwe — it stops. (mobile build)' },
  { n: 6, screen: 'SD-3', route: null, line: 'Same control with no truck at all. (mobile build)' },
  { n: 7, screen: 'DR-2', route: null, line: 'The driver accepts what the store scanned. Two people, one serial. (mobile build)' },
  { n: 8, screen: 'DR-1/3', route: null, line: 'His day. And at the door — he switches the television on before anyone signs. (mobile build)' },
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
  { href: '/transport/fleet/cost', title: 'Fleet cost', sub: 'TM-5 · April 2026' },
];
