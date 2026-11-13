// 상담 페이지 공유 그림 만들기: scripts/og-consulting.html → public/og-consulting.png (1200×630)
// 그림을 바꾸면 prerender.mjs 의 /consulting?card= 글자도 바꾼다.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(dir, 'og-consulting.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(dir, '..', 'public', 'og-consulting.png') });
await browser.close();
console.log('public/og-consulting.png 만듦');
