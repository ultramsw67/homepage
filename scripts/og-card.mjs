// 공유 카드(og:image) 1200×630 생성 — 2026-10-05
// 사용: node scripts/og-card.mjs  → public/og-card.png
// 카톡·링크드인·페이스북 미리보기는 1.91:1 로 잘리므로, 정사각 캐릭터 그림 대신 글자만 있는 카드를 쓴다.
// 색·글꼴은 블로그 위젯 배너(widget-banner.mjs, widget-series-banner.mjs)와 같은 집안: 짙은 남색·아이보리·황동
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const W = 1200, H = 630;
const out = path.join(root, 'public', 'og-card.png');

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
:root{--navy:#0b1f3a;--ivory:#f6f3ec;--brass:#b8924a;--muted:rgba(246,243,236,.72)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--navy)}
.card{position:relative;width:${W}px;height:${H}px;color:var(--ivory);font-family:'Noto Sans KR',sans-serif;
  background:radial-gradient(120% 140% at 0% 0%,#163257 0%,var(--navy) 60%);padding:84px 96px;display:flex;flex-direction:column}
.frame{position:absolute;inset:26px;border:1.5px solid rgba(246,243,236,.18)}
.frame:before,.frame:after{content:"";position:absolute;width:40px;height:40px;border-color:var(--brass);border-style:solid}
.frame:before{left:-1.5px;top:-1.5px;border-width:4px 0 0 4px}
.frame:after{right:-1.5px;bottom:-1.5px;border-width:0 4px 4px 0}
.eyebrow{font-size:28px;font-weight:700;letter-spacing:.24em;color:var(--brass)}
.head{margin-top:30px;font-family:'Noto Serif KR',serif;font-weight:700;font-size:84px;line-height:1.2;letter-spacing:-.03em}
.rule{width:80px;height:3px;background:var(--brass);margin:36px 0 30px}
.sub{font-size:34px;font-weight:500;line-height:1.55;color:var(--muted);letter-spacing:-.02em}
.url{margin-top:auto;font-size:30px;font-weight:700;letter-spacing:.02em;color:var(--ivory)}
.url span{color:#d3b071}
</style></head><body>
<div class="card"><div class="frame"></div>
  <div class="eyebrow">SUIT &amp; HOOD · 수트와후드 SOOD</div>
  <div class="head">스타트업 경영 코치 문성운</div>
  <div class="rule"></div>
  <div class="sub">현대 기획실 가치평가 · IT 스타트업 19년 운영과 매각<br>초기 창업자 1:1 경영 자문</div>
  <div class="url">soodcoach.com <span>→</span></div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), 'sood-og-card.html');
fs.writeFileSync(tmp, html, 'utf8');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 90000 });
console.log('saved', out, fs.statSync(out).size, 'bytes');
