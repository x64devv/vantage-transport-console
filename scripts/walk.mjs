/* The 13-beat running order, walked in PRESENTER ORDER across all three apps.
 *
 *   npm run walk            (all three servers up: 4173 console, 4174 dispatch, 4175 driver)
 *
 * ⚠⚠ WHY THIS EXISTS. Each app's own verify.mjs walks that app. Nothing walked
 * the beats as the room sees them — console, then the tablet, then the phone,
 * then back — so nothing checked that the three tell one story. The first run of
 * this (25 Nov) found a driver bug no per-app suite could see and four
 * cross-app disagreements. See ../GAIN-RESEED.md, last section.
 *
 * It writes a screenshot per beat to walk-shots/ (gitignored) — LOOK at them;
 * most defects in this estate were found by eye — and then checks every fact the
 * three apps share, inside the beat where it must appear. Exit 1 on any miss.
 *
 * Playwright is borrowed from the sibling driver app, which already installs it;
 * this repo deliberately has no test dependency of its own.
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, '../../vantage-driver-app/package.json'));
const { chromium } = require('playwright');

const OUT = process.argv[2] || resolve(HERE, '../walk-shots');
mkdirSync(OUT, { recursive: true });
const C = 'http://localhost:4173', D = 'http://localhost:4174', V = 'http://localhost:4175';
const EXE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(existsSync);
const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} :: ${e}`));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|tile\.openstreetmap/.test(m.text())) errors.push(`${page.url()} :: ${m.text()}`); });

const notes = [];
const T = {};
const go = async (u) => { await page.goto(u, { waitUntil: 'networkidle' }); await page.waitForTimeout(400); };
const text = () => page.evaluate(() => document.body.innerText);
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); T[n] = await text(); };
const btn = (name, i = 0) => page.getByRole('button', { name, exact: false }).nth(i);
const tryStep = async (what, fn) => { try { await fn(); } catch (e) { notes.push(`STEP FAILED: ${what} — ${String(e).split('\n')[0]}`); } };

// fresh state in every app
for (const u of [C, D, V]) { await go(u + '/'); await page.evaluate(() => localStorage.clear()); }

// Beats 1–2: the board
await go(C + '/transport/board/'); await shot('b01-02-console-board');
// Beat 3: build, the refusal, assign, preview
await go(C + '/transport/trips/build/');
await tryStep('click AHB2107', async () => { await page.getByText('AHB2107').first().click(); await page.waitForTimeout(300); });
await shot('b03a-console-refusal');
await tryStep('assign AHF5121', async () => { await page.getByText('AHF5121').first().click(); await page.waitForTimeout(300); });
await tryStep('preview route', async () => { await btn('Preview suggested route').click(); await page.waitForTimeout(1500); });
await shot('b03b-console-build');

// Beat 4: the goods-out board
await go(D + '/board/');
await tryStep('collection tab', async () => { await page.getByTestId('tab-collection').click(); await page.waitForTimeout(250); });
await shot('b04a-dispatch-collection');
await tryStep('driver tab', async () => { await page.getByTestId('tab-ourDriver').click(); await page.waitForTimeout(250); });
await shot('b04b-dispatch-driver');

// Beat 5: the block
const verifyAll = async () => {
  for (const id of ['description', 'quantity', 'condition']) {
    const b = page.getByTestId(`check-${id}`).getByRole('button', { name: 'Yes' });
    if (await b.count()) await b.click();
  }
  await page.getByTestId('verify').click(); await page.waitForTimeout(300);
};
await go(D + '/consignment/CN-MW-000121/');
await tryStep('verify block job', verifyAll);
await tryStep('scan blocked line', async () => { await page.locator('[data-testid^="scan-"]').first().click(); await page.waitForTimeout(300); });
await shot('b05-dispatch-block');

// Beat 6: a customer collects (the serialised fridge)
await go(D + '/consignment/CN-BR-000028/');
await tryStep('verify fridge', verifyAll);
await tryStep('scan fridge', async () => { await page.getByTestId('scan-1').click(); await page.waitForTimeout(200); await page.getByTestId('onward').click(); await page.waitForTimeout(300); });
await tryStep('collection evidence', async () => {
  await page.getByTestId('id-photo').click();
  const b = await page.getByTestId('signature').boundingBox();
  await page.mouse.move(b.x + b.width * 0.3, b.y + b.height * 0.5); await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.4, { steps: 8 }); await page.mouse.up();
  await page.getByTestId('complete').click(); await page.waitForTimeout(300);
});
await shot('b06-dispatch-collection');

// Beat 7: the driver accepts what the store scanned — on the dispatch tablet
for (const cid of ['CN-VE-000418', 'CN-VE-000421', 'CN-VE-000424', 'CN-VE-000427', 'CN-VE-000429']) {
  await go(D + `/consignment/${cid}/`);
  await tryStep(`verify ${cid}`, verifyAll);
  if (page.url().includes('/scan/')) {
    for (let i = 0; i < 6; i++) { const b = page.locator('[data-testid^="scan-"]'); if (!(await b.count())) break; await b.first().click(); await page.waitForTimeout(120); }
    await tryStep(`onward ${cid}`, async () => { await page.getByTestId('onward').click(); await page.waitForTimeout(300); });
  }
}
await go(D + '/handover/LD-000377/');
await tryStep('seal', async () => { await page.getByTestId('seal').click(); await page.waitForTimeout(250); });
await tryStep('driver signs', async () => {
  const b = await page.getByTestId('signature').boundingBox();
  await page.mouse.move(b.x + b.width * 0.3, b.y + b.height * 0.5); await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.4, { steps: 8 }); await page.mouse.up();
  await page.getByTestId('accept').click(); await page.waitForTimeout(300);
});
await shot('b07-dispatch-handover');

// Beat 8: his day, and the freezer switched on at the door
await go(V + '/'); await shot('b08a-driver-signin');
await go(V + '/run/'); await shot('b08b-driver-run');
await go(V + '/stop/4/');
await tryStep('four checks + test', async () => {
  const yes = page.getByRole('button', { name: 'Yes', exact: true });
  for (let i = 0; i < 4; i++) await yes.nth(i).click();
  await btn('Passed').click(); await page.waitForTimeout(250);
});
await shot('b08c-driver-stop4');
await tryStep('proof', async () => {
  await btn('Take proof of delivery').click(); await page.waitForTimeout(350);
  await page.getByText('The goods, in place').click(); await page.getByText("Receiver's ID").click();
  const b = await page.locator('canvas').first().boundingBox();
  await page.mouse.move(b.x + b.width * 0.25, b.y + 40); await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.75, b.y + 110, { steps: 12 }); await page.mouse.up();
  await page.waitForTimeout(250);
});
await shot('b08d-driver-proof');

// Beat 9: cash with no signal
await tryStep('to cash', async () => { await btn('Confirm delivery, then take the money').click(); await page.waitForTimeout(350); });
await tryStep('type 1150', async () => { for (const k of ['1', '1', '5', '0']) await page.getByRole('button', { name: k, exact: true }).first().click(); await page.waitForTimeout(250); });
await shot('b09a-driver-cash');
await tryStep('complete stop 4', async () => { await btn('Complete stop 4').click(); await page.waitForTimeout(450); });
await shot('b09b-driver-recorded');

// Beat 10: nobody home
await go(V + '/stop/5/failed/');
await tryStep('nobody home', async () => { await btn('Nobody at the address').click(); await page.waitForTimeout(200); });
await shot('b10a-driver-failed');
await tryStep('record failed', async () => { await btn('Record the failed stop').click(); await page.waitForTimeout(400); });
await shot('b10b-driver-failed-recorded');
await go(V + '/debrief/'); await page.setViewportSize({ width: 1600, height: 1400 }); await shot('b10c-driver-debrief'); await page.setViewportSize({ width: 1600, height: 1000 });

// Beats 11–13
await go(C + '/transport/live/'); await shot('b11-console-live');
await go(C + '/transport/fleet/cost/'); await shot('b12-console-cost');
await go(C + '/transport/search/');
await tryStep('search 414414', async () => { await page.getByRole('button', { name: '414414', exact: true }).first().click(); await page.waitForTimeout(400); });
await page.setViewportSize({ width: 1600, height: 1400 }); await shot('b13-console-search'); await page.setViewportSize({ width: 1600, height: 1000 });

// Phase 2 extras, after the running order
await go(D + '/board/'); await tryStep('carrier tab', async () => { await page.getByTestId('tab-carrier').click(); await page.waitForTimeout(250); }); await shot('x1-dispatch-carrier-tab');
await tryStep('returns tab', async () => { await page.getByTestId('tab-returning').click(); await page.waitForTimeout(250); }); await shot('x2-dispatch-returns-tab');
await go(C + '/transport/reports/'); await shot('x3-console-reports');

await browser.close();

/* ── The facts the three apps share, checked where the room reads them ───── */
const FACTS = [
  ['#G-000004791204', ['b08c-driver-stop4', 'b09b-driver-recorded', 'b13-console-search']],
  ['AHF5121', ['b03b-console-build', 'b07-dispatch-handover', 'b08a-driver-signin', 'b10c-driver-debrief', 'b11-console-live', 'b13-console-search']],
  ['GC103', ['b07-dispatch-handover', 'b08b-driver-run', 'b13-console-search']],
  ['T. Mukanya', ['b07-dispatch-handover', 'b08a-driver-signin', 'b11-console-live', 'b13-console-search']],
  ['W. Sibindi', ['b07-dispatch-handover', 'b13-console-search']],
  ['Z-114882', ['b07-dispatch-handover', 'b10c-driver-debrief']],
  ['TR-HRE-2026-08-20-05', ['b03b-console-build', 'b08b-driver-run', 'b11-console-live', 'b12-console-cost', 'b13-console-search']],
  ['PAY-101-D204-000037', ['b09b-driver-recorded', 'b13-console-search']],
  ['1 150.00', ['b09a-driver-cash', 'b13-console-search']],
  ['Chest freezer Defy 300L CF300', ['b08c-driver-stop4', 'b13-console-search']],
  ['Nancy Muhoni', ['b03b-console-build', 'b04b-dispatch-driver', 'b08b-driver-run', 'b13-console-search']],
  ['EX-000029114', ['b05-dispatch-block', 'b11-console-live']],
  ['Kwekwe', ['b05-dispatch-block', 'b11-console-live']],
  ['07:31', ['b05-dispatch-block', 'b11-console-live']],
  ['C. Nyathi', ['b11-console-live']],
  ['EX-000029155', ['b11-console-live']],
  ['Metro Borrowdale', ['b03b-console-build', 'b04b-dispatch-driver', 'b08b-driver-run']],
  ['Thu 20 Aug 2026 · 07:15', ['b01-02-console-board', 'b03b-console-build']],
  ['Thu 20 Aug 2026 · 15:20', ['b11-console-live']],
  ['Thu 20 Aug 2026 · 18:20', ['b12-console-cost', 'b13-console-search']],
  ["not gain's records", Object.keys(T)],
];
const norm = (t) => (t || '').replace(/’/g, "'").toLowerCase();
for (const [fact, where] of FACTS) {
  for (const k of where) if (!norm(T[k]).includes(fact.toLowerCase())) notes.push(`MISSING ${JSON.stringify(fact)} on ${k}`);
}
/* Trip 05 on the console is the driver's run — a stop from the old list is a regression. */
for (const gone of ['F. Nyoni', 'W. Mhaka']) if (T['b03b-console-build']?.includes(gone)) notes.push(`TM-2 still lists ${gone}: trip 05 is not the driver's run`);
/* No TVSH record may render anywhere. */
const OLD = /TVSH|Village Walk|Mega Watt|AGE5599|TVS10\d|OB-MP-GB|Samsung/;
for (const [k, t] of Object.entries(T)) { const m = (t || '').match(OLD); if (m) notes.push(`OLD DATA ${m[0]} on ${k}`); }

writeFileSync(`${OUT}/texts.json`, JSON.stringify(T, null, 1));
const all = [...notes, ...errors.map((e) => 'ERROR: ' + e)];
writeFileSync(`${OUT}/notes.txt`, all.join('\n') + '\n');
const checks = FACTS.reduce((n, [, w]) => n + w.length, 0);
console.log(all.length ? all.join('\n') : `walk: 13 beats + Phase 2, ${checks} shared-fact checks, no step failures, no page errors`);
console.log(`screenshots: ${OUT} — look at them.`);
process.exit(all.length ? 1 : 0);
