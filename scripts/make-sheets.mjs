// 체크표 4종 PDF 만들기: scripts/sheets/sheets.html → public/sheets/*.pdf (A4 한 장씩) — 2026-10-09
// 실행: node scripts/make-sheets.mjs  (표 문구를 고치면 다시 돌리고 PDF 를 같이 커밋)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const NAMES = ['sood-customer-talk-note', 'sood-unit-economics', 'sood-pitch-deck-12', 'sood-poc-agreement'];
const OUT = resolve('public/sheets');
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('scripts/sheets/sheets.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
for (let i = 0; i < NAMES.length; i++) {
  await page.evaluate((n) => document.querySelectorAll('.a4').forEach((el, j) => { el.style.display = j === n ? '' : 'none'; }), i);
  await page.pdf({ path: `${OUT}/${NAMES[i]}.pdf`, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
  console.log('만듦:', `public/sheets/${NAMES[i]}.pdf`);
}
await browser.close();
