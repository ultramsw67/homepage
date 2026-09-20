// 네이버 블로그 사이드바 위젯 배너(가로 170px 규격, 3배 해상도 510×759) 생성
// 사용: node scripts/widget-banner.mjs  → public/sood-widget.png
// 홈페이지 브랜드 토큰(src/index.css: navy #0b1f3a, brass #b8924a, Noto Serif KR) 사용. Chrome 헤드리스로 렌더.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const W = 510, H = 759;   // 170×253 의 3배
const out = path.join(root, 'public', 'sood-widget.png');

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
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:54px 36px 40px}
.frame{position:absolute;inset:14px;border:1.5px solid rgba(211,176,113,.38);pointer-events:none}
.frame:before,.frame:after{content:"";position:absolute;width:22px;height:22px;border-color:var(--brass-lit);border-style:solid}
.frame:before{left:-1.5px;top:-1.5px;border-width:3px 0 0 3px}
.frame:after{right:-1.5px;bottom:-1.5px;border-width:0 3px 3px 0}
.mark{font-family:'Noto Serif KR',serif;font-weight:700;font-size:80px;letter-spacing:.2em;margin-left:.2em;color:var(--brass-lit);line-height:1}
.brand{margin-top:14px;font-size:23px;font-weight:500;letter-spacing:.42em;margin-left:.42em;color:var(--muted)}
.rule{width:56px;height:2px;background:var(--brass);margin:36px 0 32px;opacity:.9}
.eyebrow{font-size:25px;font-weight:700;letter-spacing:.16em;margin-left:.16em;color:var(--brass-lit)}
.head{margin-top:14px;font-family:'Noto Serif KR',serif;font-weight:700;font-size:54px;line-height:1.28;letter-spacing:-.03em;color:var(--ivory)}
.axes{margin-top:24px;font-size:25px;font-weight:500;line-height:1.6;color:var(--muted);letter-spacing:-.01em}
.axes b{color:var(--ivory);font-weight:500}
.cta{margin-top:auto;width:100%;height:92px;border-radius:4px;background:linear-gradient(180deg,#d3b071,#b8924a);color:#0b1f3a;
  font-size:31px;font-weight:700;letter-spacing:-.01em;display:flex;align-items:center;justify-content:center;gap:12px;
  box-shadow:0 10px 30px -12px rgba(0,0,0,.6)}
.cta span{font-size:30px}
.url{margin-top:24px;font-size:26px;font-weight:500;letter-spacing:.05em;color:rgba(246,243,236,.86)}
</style></head><body>
<div class="card"><div class="frame"></div>
  <div class="mark">SOOD</div>
  <div class="brand">수트와후드</div>
  <div class="rule"></div>
  <div class="eyebrow">스타트업 경영 코치</div>
  <div class="head">수트의 논리,<br>후드의 실행.</div>
  <div class="axes">사업모델 · 지표 · 투자유치<br><b>1인 기업</b> 첫 매출까지</div>
  <div class="cta">1:1 자문 신청 <span>→</span></div>
  <div class="url">soodcoach.com</div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), 'sood-widget.html');
fs.writeFileSync(tmp, html, 'utf8');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 90000 });
console.log('saved', out, fs.statSync(out).size, 'bytes');
