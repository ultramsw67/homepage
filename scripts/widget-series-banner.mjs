// 네이버 블로그 사이드바 「수드의 연재」 위젯 배너 (가로 170px 규격, 3배 해상도 510×600) 생성 — 2026-10-05
// 사용: node scripts/widget-series-banner.mjs  → public/sood-widget-series.png  (누르면 soodcoach.com/series)
// 바로 위 「수드 홈페이지」 배너(widget-banner.mjs, 짙은 남색)와 한 집안이되 구분되게 밝기를 뒤집었다: 아이보리 바탕·남색 글씨·남색 버튼, 황동은 포인트만
// 글자 크기 등위 (진단 위젯과 같음, 10/9): 라벨 14 · 제목 19.5 · 설명 11 · 버튼 14.5 (화면 px, 여기선 ×3) · 글꼴 Pretendard
// 편 수는 public/series.json 에서 읽는다. import-series.mjs 가 편 수가 바뀔 때마다 이 스크립트를 다시 돌린다 (그림 캐시 1시간)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const W = 510, H = 684;   // 170×228 의 3배 (10/9 글자 등위를 진단 위젯과 맞추며 높이 200→228)
const out = path.join(root, 'public', 'sood-widget-series.png');
const total = JSON.parse(fs.readFileSync(path.join(root, 'public', 'series.json'), 'utf8')).total;

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
:root{--navy:#0b1f3a;--ivory:#f6f3ec;--paper:#fbf9f4;--brass:#b8924a;--muted:rgba(11,31,58,.68)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--ivory)}
.card{position:relative;width:${W}px;height:${H}px;color:var(--navy);font-family:'Pretendard Variable',Pretendard,sans-serif;letter-spacing:-.033em;
  background:linear-gradient(175deg,var(--paper) 0%,var(--ivory) 100%);
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:52px 42px 42px}
.frame{position:absolute;inset:14px;border:1.5px solid rgba(11,31,58,.22);pointer-events:none}
.frame:before,.frame:after{content:"";position:absolute;width:22px;height:22px;border-color:var(--brass);border-style:solid}
.frame:before{left:-1.5px;top:-1.5px;border-width:3px 0 0 3px}
.frame:after{right:-1.5px;bottom:-1.5px;border-width:0 3px 3px 0}
.eyebrow{font-size:42px;font-weight:800;letter-spacing:-.01em;color:var(--brass)}
.head{margin-top:20px;font-weight:800;font-size:58.5px;line-height:1.38;letter-spacing:-.035em}
.head em{font-style:normal;color:var(--brass)}
.rule{width:56px;height:4px;background:var(--brass);margin:26px 0 22px}
.axes{font-size:33px;font-weight:500;line-height:1.5;color:var(--muted);letter-spacing:-.02em}
.cta{margin-top:auto;width:100%;height:102px;border-radius:9px;background:var(--navy);color:var(--ivory);
  font-size:43.5px;font-weight:800;letter-spacing:-.03em;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:8px}
.cta span{color:#d3b071}
</style></head><body>
<div class="card"><div class="frame"></div>
  <div class="eyebrow">사례 연재 6</div>
  <div class="head">스타트업 사례<br><em>${total}편</em>을<br>분석했습니다</div>
  <div class="rule"></div>
  <div class="axes">돈 버는 구조 · 첫 제품 · 피벗<br>1인 기업 · AI · 창업자</div>
  <div class="cta">연재 모아 보기 <span>→</span></div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), 'sood-widget-series.html');
fs.writeFileSync(tmp, html, 'utf8');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 90000 });
console.log('saved', out, `(${total}편)`, fs.statSync(out).size, 'bytes');
