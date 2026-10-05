// 네이버 블로그 사이드바 「수드의 연재 6개」 위젯 배너 (가로 170px 규격, 3배 해상도 510×600) 생성 — 2026-10-05
// 사용: node scripts/widget-series-banner.mjs  → public/sood-widget-series.png  (누르면 soodcoach.com/series)
// 바로 위 「수드 홈페이지」 배너(widget-banner.mjs)와 같은 navy·brass 토큰으로 맞춘다
// 홈페이지 브랜드 토큰(src/index.css: navy #0b1f3a, brass #b8924a, Noto Serif KR) 사용. Chrome 헤드리스로 렌더.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const W = 510, H = 600;   // 170×200 의 3배
const out = path.join(root, 'public', 'sood-widget-series.png');

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
:root{--navy:#0b1f3a;--navy2:#132b4f;--ivory:#f6f3ec;--brass:#b8924a;--brass-lit:#d3b071;--muted:rgba(246,243,236,.72)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--navy)}
.card{position:relative;width:${W}px;height:${H}px;color:var(--ivory);font-family:'Noto Sans KR',sans-serif;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(211,176,113,.18) 0%, rgba(211,176,113,0) 55%),
    linear-gradient(170deg,#102848 0%,var(--navy) 55%,#081628 100%);
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:48px 40px 40px}
.frame{position:absolute;inset:14px;border:1.5px solid rgba(211,176,113,.38);pointer-events:none}
.frame:before,.frame:after{content:"";position:absolute;width:22px;height:22px;border-color:var(--brass-lit);border-style:solid}
.frame:before{left:-1.5px;top:-1.5px;border-width:3px 0 0 3px}
.frame:after{right:-1.5px;bottom:-1.5px;border-width:0 3px 3px 0}
.eyebrow{font-size:24px;font-weight:700;letter-spacing:.3em;margin-left:.3em;color:var(--brass-lit)}
.head{margin-top:16px;font-family:'Noto Serif KR',serif;font-weight:700;font-size:52px;line-height:1.25;letter-spacing:-.03em;color:var(--ivory)}
.rule{width:56px;height:2px;background:var(--brass);margin:26px 0 22px;opacity:.9}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;width:100%;font-size:25px;font-weight:500;color:var(--muted);letter-spacing:-.02em;text-align:left}
.grid span{white-space:nowrap}.grid b{color:var(--brass-lit);font-weight:700;margin-right:8px}
.cta{margin-top:auto;width:100%;height:92px;border-radius:4px;background:linear-gradient(180deg,#d3b071,#b8924a);color:#0b1f3a;
  font-size:33px;font-weight:700;letter-spacing:-.04em;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 10px 30px -12px rgba(0,0,0,.6)}
.cta span{font-size:30px}
</style></head><body>
<div class="card"><div class="frame"></div>
  <div class="eyebrow">SERIES</div>
  <div class="head">수드의<br>사례 연재 6</div>
  <div class="rule"></div>
  <div class="grid"><span><b>A</b>BM 해부</span><span><b>B</b>MVP</span><span><b>C</b>피벗</span><span><b>D</b>1인 기업</span><span><b>E</b>AI 스타트업</span><span><b>F</b>창업자</span></div>
  <div class="cta">연재 모아 보기 <span>→</span></div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), 'sood-widget-series.html');
fs.writeFileSync(tmp, html, 'utf8');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 90000 });
console.log('saved', out, fs.statSync(out).size, 'bytes');
