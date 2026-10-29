// Checks the week calculation of the Netlify edge function against known dates, including the Vienna/UTC boundary.
// Usage: npm run check:week
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../netlify/edge-functions/lib/week.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'week-'));
const file = path.join(dir, 'week.mjs');
fs.writeFileSync(file, js);
const { currentWeek } = await import(pathToFileURL(file).href);

const cases = [
  // [instant (UTC), expected week, expected Monday, expected Sunday, why]
  ['2026-10-29T12:00:00Z', 44, '26.10.2026', '01.11.2026', 'an ordinary Thursday'],
  ['2025-12-29T09:00:00Z', 1, '29.12.2025', '04.01.2026', 'December days that belong to week 1 of the next year'],
  ['2026-01-01T09:00:00Z', 1, '29.12.2025', '04.01.2026', 'New Year, still week 1'],
  ['2021-01-03T09:00:00Z', 53, '28.12.2020', '03.01.2021', 'a year with 53 weeks, Sunday'],
  ['2020-12-31T09:00:00Z', 53, '28.12.2020', '03.01.2021', 'a year with 53 weeks, Thursday'],
  ['2024-02-29T09:00:00Z', 9, '26.02.2024', '03.03.2024', 'leap day'],
  // UTC still says Sunday 25 October, in Vienna it is already Monday 26 October 00:30
  ['2026-10-25T23:30:00Z', 44, '26.10.2026', '01.11.2026', 'Vienna is already in the new week, UTC is not'],
  // summer time: 22:30 UTC on Sunday is 00:30 CEST on Monday
  ['2026-06-14T22:30:00Z', 25, '15.06.2026', '21.06.2026', 'summer time, Sunday night in UTC is Monday in Vienna'],
  // the other direction: Sunday 23:30 in Vienna is still the old week
  ['2026-10-25T22:30:00Z', 43, '19.10.2026', '25.10.2026', 'Sunday 23:30 in Vienna (CET after the clock change) is still the old week'],
];

let failed = 0;
for (const [instant, week, start, end, why] of cases) {
  const got = currentWeek(new Date(instant));
  const ok = got.week === week && got.start === start && got.end === end;
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${instant} KW ${got.week} ${got.start}-${got.end}${ok ? '' : `  (expected KW ${week} ${start}-${end})`}  ${why}`);
}
fs.rmSync(dir, { recursive: true, force: true });
console.log(failed ? `\n${failed} case(s) failed.` : '\nAll cases passed.');
process.exit(failed ? 1 : 0);
