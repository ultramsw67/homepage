// 네이버 블로그 사이드바 「3분 진단」 위젯 배너 (가로 170px 규격, 3배 해상도 510×600) 생성 — 2026-10-09
// 사용: node scripts/widget-check-banner.mjs  → public/sood-widget-check.png  (누르면 soodcoach.com/check)
// 위 두 위젯(홈페이지=짙은 남색, 연재=아이보리)과 한 집안이되 구분되게 파랑(홈페이지 포인트 색 #1f4bb8) 바탕·흰 글씨, 황동은 포인트만
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const W = 510, H = 600;   // 170×200 의 3배
const out = path.join(root, 'public', 'sood-widget-check.png');

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
:root{--blue:#1f4bb8;--blue-d:#173a8f;--navy:#0b1f3a;--brass:#d3b071;--white:#fff}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--blue)}
.card{position:relative;width:${W}px;height:${H}px;color:var(--white);font-family:'Noto Sans KR',sans-serif;
  background:linear-gradient(170deg,var(--blue) 0%,var(--blue-d) 100%);
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:50px 40px 40px}
.frame{position:absolute;inset:14px;border:1.5px solid rgba(255,255,255,.28);pointer-events:none}
.frame:before,.frame:after{content:"";position:absolute;width:22px;height:22px;border-color:var(--brass);border-style:solid}
.frame:before{left:-1.5px;top:-1.5px;border-width:3px 0 0 3px}
.frame:after{right:-1.5px;bottom:-1.5px;border-width:0 3px 3px 0}
.eyebrow{font-size:23px;font-weight:700;letter-spacing:.22em;margin-left:.22em;color:var(--brass)}
.head{margin-top:18px;font-family:'Noto Serif KR',serif;font-weight:700;font-size:48px;line-height:1.3;letter-spacing:-.03em}
.head em{font-style:normal;color:var(--brass)}
.rule{width:56px;height:2px;background:var(--brass);margin:24px 0 20px}
.axes{font-size:24px;font-weight:500;line-height:1.65;color:rgba(255,255,255,.82);letter-spacing:-.02em}
.cta{margin-top:auto;width:100%;height:88px;border-radius:4px;background:var(--white);color:var(--navy);
  font-size:32px;font-weight:700;letter-spacing:-.03em;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:8px}
.cta span{color:var(--blue)}
</style></head><body>
<div class="card"><div class="frame"></div>
  <div class="eyebrow">3분 진단</div>
  <div class="head">내 창업 준비,<br>지금 <em>어디쯤</em><br>일까요?</div>
  <div class="rule"></div>
  <div class="axes">질문 10개 · 연락처 없음<br>이번 주 할 일 1개</div>
  <div class="cta">진단해 보기 <span>→</span></div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), 'sood-widget-check.html');
fs.writeFileSync(tmp, html, 'utf8');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 90000 });
console.log('saved', out, fs.statSync(out).size, 'bytes');
