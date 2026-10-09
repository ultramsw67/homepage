// 네이버 블로그 사이드바 「3분 진단」 질문형 위젯 (2026-10-09)
// 배너가 먼저 진단 첫 질문을 건다 → [예][조금][아니오] 를 누르면 그 답을 들고 /check 로 가서 나머지 9개를 잇는다.
// 네이버 위젯은 그림+링크만 되므로 그림 5조각(질문·버튼 3·아래 띠)을 따로 찍고, 위젯 코드에서 조각마다 링크를 건다.
// 글꼴: 홈페이지와 같은 Pretendard (10/9 대표님 "홈페이지와 같게")
// 글자 크기 등위 (연재 위젯과 같음, 10/9): 라벨 14 · 제목 19.5 · 설명 11 · 버튼 14.5 · 보조 10.5 (화면 px)
// 사용: node scripts/widget-check-quiz.mjs → public/widget-check/*.png (가로 170px, 3배 해상도) + 위젯 코드 출력
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve('public/widget-check');
mkdirSync(OUT, { recursive: true });
const Q = 1;   // 2번 질문: 고객 5명 이상과 직접 이야기해 봤나요? (블로그 독자 대부분이 '아니오'·'조금' — 바로 다음 칸이 보이는 질문)
const VER = '20261009e';
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
*{box-sizing:border-box;margin:0;padding:0}
body{width:170px;background:#fff;font-family:'Pretendard Variable',Pretendard,sans-serif;letter-spacing:-.011em;-webkit-font-smoothing:antialiased}
#q{width:170px;height:214px;position:relative;background:linear-gradient(170deg,#1f4bb8,#173a8f);color:#fff;padding:16px 14px 0;text-align:left}
#q .k{display:flex;justify-content:space-between;align-items:center}
#q .k .tag{display:inline-block;background:#fff;color:#1f4bb8;font-size:14px;font-weight:800;letter-spacing:-.01em;padding:4px 9px 5px;border-radius:3px;box-shadow:0 0 0 2px #d3b071}
#q .k b{font-weight:700;color:rgba(255,255,255,.75);font-size:10.5px}
#q .bar{height:2px;background:rgba(255,255,255,.18);margin:11px 0 12px}
#q .bar i{display:block;width:10%;height:100%;background:#d3b071}
#q .t{font-weight:800;font-size:19.5px;line-height:1.38;letter-spacing:-.035em}
#q .t em{font-style:normal;color:#d3b071}
#q .s{position:absolute;left:14px;right:14px;bottom:12px;font-size:11px;font-weight:500;color:rgba(255,255,255,.8);line-height:1.5}
.row{display:flex;width:170px}
.b{height:46px;display:flex;align-items:center;justify-content:center;font-size:14.5px;font-weight:800;letter-spacing:-.02em;background:#173a8f;color:#fff;border-top:1px solid rgba(255,255,255,.22)}
.b span{display:flex;align-items:center;justify-content:center;width:calc(100% - 8px);height:34px;background:#fff;color:#0b1f3a;border-radius:3px}
#y{width:57px;padding-left:4px}#m{width:56px}#n{width:57px;padding-right:4px}
#y span{width:calc(100% - 4px)}#n span{width:calc(100% - 4px)}
#f{width:170px;height:34px;background:#173a8f;color:rgba(255,255,255,.85);font-size:10.5px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:4px}
#f b{color:#fff;font-weight:700}
</style></head><body>
<div id="q"><div class="k"><span class="tag">3분 진단</span><b>1 / 10</b></div><div class="bar"><i></i></div>
<div class="t">내 고객 <em>5명</em>과<br>직접 이야기해<br>봤나요?</div>
<div class="s">아래에서 하나 누르면<br>나머지 9개로 이어집니다</div></div>
<div class="row"><div class="b" id="y"><span>예</span></div><div class="b" id="m"><span>조금</span></div><div class="b" id="n"><span>아니오</span></div></div>
<div id="f">연락처 없이 3분 · <b>처음부터 하기 →</b></div>
</body></html>`;

const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
const page = await browser.newPage({ viewport: { width: 170, height: 400 }, deviceScaleFactor: 3 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const parts = { q: 'q', y: 'yes', m: 'some', n: 'no', f: 'foot' };
const size = {};
for (const [id, name] of Object.entries(parts)) {
  const el = page.locator('#' + id);
  await el.screenshot({ path: `${OUT}/${name}.png` });
  const b = await el.boundingBox();
  size[name] = [Math.round(b.width), Math.round(b.height)];
}
await browser.close();

const utm = 'utm_source=naver_blog&amp;utm_medium=widget&amp;utm_campaign=check_quiz';
const img = (n, alt) => `<img src="https://soodcoach.com/widget-check/${n}.png?v=${VER}" width="${size[n][0]}" height="${size[n][1]}" border="0" alt="${alt}" style="display:block;float:left" />`;
const ans = (v, n, alt) => `<a target="_blank" href="https://soodcoach.com/check?q=${Q}&amp;v=${v}&amp;from=widget&amp;${utm}">${img(n, alt)}</a>`;
const code = `<div style="width:170px;overflow:hidden"><a target="_blank" href="https://soodcoach.com/check?${utm}">${img('q', '3분 창업 준비도 진단 1/10 - 내 고객 5명과 직접 이야기해 봤나요?')}</a>${ans(10, 'yes', '예')}${ans(5, 'some', '조금')}${ans(0, 'no', '아니오')}<a target="_blank" href="https://soodcoach.com/check?${utm}">${img('foot', '연락처 없이 3분 - 처음부터 하기')}</a></div>`;
console.log(JSON.stringify(size));
console.log(code);
