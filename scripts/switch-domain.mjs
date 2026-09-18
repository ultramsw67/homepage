// 홈페이지 주소를 새 도메인으로 한 번에 바꾼다.
//   node scripts/switch-domain.mjs soodcoach.com          (실제 교체)
//   node scripts/switch-domain.mjs soodcoach.com --dry    (바꾸지 않고 보기만)
// 새 도메인이 https 로 실제 열린 뒤에 실행한다. 바꾼 뒤 npm run import:blog → npm run build 로 sitemap·rss·llms.txt 를 다시 만든다.
import { readFileSync, writeFileSync } from 'node:fs';

const NEW = (process.argv[2] || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const DRY = process.argv.includes('--dry');
const OLD = 'sood-page.web.app';
const OLD_HOSTS = [OLD, 'sood-page.firebaseapp.com', `${NEW.replace(/.com$/, '.co.kr')}`, `www.${NEW.replace(/.com$/, '.co.kr')}`, `www.${NEW}`];

if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(NEW)) {
  console.error('새 도메인을 주세요. 예: node scripts/switch-domain.mjs soodcoach.com');
  process.exit(1);
}
if (NEW === OLD) { console.error('옛 주소와 같습니다.'); process.exit(1); }

const edit = (f, fn, label) => {
  const before = readFileSync(f, 'utf8');
  const after = fn(before);
  if (after === before) return false;
  console.log(`${DRY ? '[미리보기] ' : ''}${f.padEnd(26)} ${label(before, after)}`);
  if (!DRY) writeFileSync(f, after);
  return true;
};
const count = (s) => s.split(OLD).length - 1;

// 1) 주소 문자열 교체 (sitemap.xml 은 import:blog 가 다시 만든다)
for (const f of ['index.html', 'public/robots.txt', 'scripts/import-blog.mjs', 'scripts/indexnow.mjs', 'scripts/prerender.mjs', 'src/lib/site.js']) {
  edit(f, (s) => s.split(OLD).join(NEW), (b) => `${count(b)}곳`);
}

// 2) 방문 분석: 새 주소에서 집계
edit('src/lib/analytics.js', (s) => s
  .replace(/^const HOST = '.*';$/m, `const HOSTS = ['${NEW}', 'www.${NEW}'];`)
  .replace(/(?:window\.)?location\.hostname\s*===\s*HOST\b/g, 'HOSTS.includes(window.location.hostname)')
  .split(`실제 사이트(${OLD})에서만`).join(`실제 사이트(${NEW})에서만`),
  () => '새 주소에서 집계');

// 3) 옛 주소·co.kr·www 로 들어오면 같은 경로의 새 주소로 넘긴다 (PR 미리보기 주소 sood-page--xxx.web.app 는 제외)
const MARK = '<!-- old-host-redirect -->';
const snippet = `    ${MARK}\n    <script>if(${JSON.stringify(OLD_HOSTS)}.indexOf(location.hostname)>-1)location.replace('https://${NEW}'+location.pathname+location.search+location.hash)</script>\n`;
edit('index.html', (s) => s.includes(MARK)
  ? s.replace(new RegExp(`\s*${MARK}\n\s*<script>[^\n]*</script>\n`), `\n${snippet}`)
  : s.replace(/(<head>\s*\n)/, `$1${snippet}`),
  () => '옛 주소 → 새 주소 이동 스크립트');

console.log('\n다음: npm run import:blog → npm run build → npx playwright test → 커밋·push');
