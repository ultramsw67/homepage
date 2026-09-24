import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const posts = JSON.parse(readFileSync('public/posts/index.json', 'utf8'));
const first = posts[0].id;

for (const width of [390, 768, 1440]) {
  test('responsive routes at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of ['/', '/about', '/consulting', '/articles', '/articles/' + first, '/missing', '/articles/missing']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
    expect(errors).toEqual([]);
  });
}

test('first paint: no prerender flash, hero visible within 1s', async ({ page }) => {
  // JS 도착을 늦춰도 검색로봇용 본문(#root > .page)이 화면에 보이면 안 된다
  await page.route('**/assets/index-*.js', async (route) => { await new Promise((r) => setTimeout(r, 700)); route.continue(); });
  await page.goto('/', { waitUntil: 'commit' });
  await page.waitForTimeout(250);
  expect(await page.locator('#root > .page').count() === 0 || !(await page.locator('#root > .page').first().isVisible())).toBe(true);
  await page.locator('.hero h1').waitFor({ state: 'attached', timeout: 10000 });
  await page.waitForTimeout(1000);
  const opacity = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.hero h1')).opacity));
  expect(opacity).toBeGreaterThan(0.95);
});

test('contact uses ultramsw67@gmail.com and no themoontech', async ({ page }) => {
  await page.goto('/consulting');
  const mailto = await page.locator('a.contact-email').getAttribute('href');
  expect(mailto).toBe('mailto:ultramsw67@gmail.com');
  const html = await page.content();
  expect(html).not.toContain('themoontech');
  expect(html).not.toContain('더문테크');
  // 2026-09-09: 더문테크는 소개 페이지 경력 타임라인(과거 전략 고문)에만 나타나야 한다. 옛 연락처(themoontech)는 어디에도 없어야 한다.
  await page.goto('/about');
  const about = await page.content();
  expect(about).not.toContain('themoontech');
  expect(await page.locator('.timeline').textContent()).toContain('더문테크');
  expect(await page.locator('.timeline').textContent()).toContain('전략 고문');
  await page.goto('/');
  const home = await page.content();
  expect(home).not.toContain('themoontech');
  // 홈의 '지나온 길' 타임라인에도 같은 경력이 표시된다
  expect(await page.locator('.timeline').textContent()).toContain('전략 고문');
});

test('consulting FAQ opens and answers', async ({ page }) => {
  await page.goto('/consulting#faq');
  const items = page.locator('.faq-list details');
  await expect(items).toHaveCount(6);
  // 2026-09-18 리디자인: 첫 항목은 기본으로 열려 있고, 나머지는 눌러서 연다
  await expect(items.first().locator('p')).toBeVisible();
  await items.nth(1).locator('summary').click();
  await expect(items.nth(1).locator('p')).toBeVisible();
});

test('mobile menu and consultation anchor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: '상담 문의', exact: true }).click();
  await expect(page).toHaveURL(/consulting#contact/);
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('form').evaluate((f) => f.checkValidity())).toBeFalsy();
  await page.locator('#name').fill('검증용 팀');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('MVP 검증 상담 테스트');
  expect(await page.locator('form').evaluate((f) => f.checkValidity())).toBeTruthy();
});

test('journal filters, search and reading', async ({ page }) => {
  const brunch = JSON.parse(readFileSync('public/brunch.json', 'utf8'));
  await page.goto('/articles');
  await expect(page.locator('.post-card').first()).toBeVisible();
  await expect(page.locator('.result-count')).toContainText(String(posts.length + brunch.posts.length));
  await page.getByRole('button', { name: /^네이버 블로그/ }).click();
  await expect(page.locator('.result-count')).toContainText(String(posts.length));
  await page.getByRole('button', { name: '창업자 멘탈·조직', exact: true }).click();
  const fm = posts.filter((p) => p.category === '창업자-멘탈·조직').length;
  await expect(page.locator('.result-count')).toContainText(String(fm));
  await page.getByRole('button', { name: '전체', exact: true }).click();
  await page.getByRole('searchbox').fill('Canva');
  await expect(page.locator('.post-card').first()).toBeVisible();
  await page.locator('.post-card').first().click();
  await expect(page.locator('.article-body')).toBeVisible();
  await expect(page.locator('.article-body img').first()).toHaveAttribute('referrerpolicy', 'no-referrer');
  await page.goto('/articles?q=존재하지않는주제');
  await expect(page.getByRole('status')).toContainText('검색 결과가 없습니다');
});

test('review screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/');
  await page.waitForSelector('.post-card');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'tmp/home-desktop.png', fullPage: true });
  await page.goto('/articles/' + first);
  await page.waitForSelector('.article-body');
  await page.screenshot({ path: 'tmp/article-desktop.png', fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForSelector('.post-card');
  await page.screenshot({ path: 'tmp/home-mobile.png', fullPage: true });
  await page.goto('/about');
  await page.screenshot({ path: 'tmp/about-mobile.png', fullPage: true });
});

test('home lead card carries name, email and issue into the consulting form', async ({ page }) => {
  await page.goto('/');
  await page.locator('#leadName').fill('검증용 팀');
  await page.locator('#leadEmail').fill('lead@example.com');
  await page.locator('#leadIssue').fill('첫 매출이 안 나옵니다');
  await page.getByRole('button', { name: '이어서 작성하기' }).click();
  await expect(page).toHaveURL(/consulting#contact/);
  await expect(page.locator('#name')).toHaveValue('검증용 팀');
  await expect(page.locator('#email')).toHaveValue('lead@example.com');
  await expect(page.locator('#message')).toHaveValue('첫 매출이 안 나옵니다');
  await expect(page.locator('#contact')).toBeInViewport();
});

// 2026-09-22: 한글 검색어가 조합 중에 풀려 'ㅅ스슽스타…'로 들어가던 문제 (데스크톱·모바일 모두)
test('글 검색: 한글을 조합해 넣어도 그대로 들어간다', async ({ page, context }) => {
  await page.goto('/articles');
  const input = page.locator('input[type=search]').first();
  await input.click();
  const cdp = await context.newCDPSession(page);
  for (const s of ['ㅅ', '스', '슽', '스타', '스탙', '스타트', '스타트ㅇ', '스타트어', '스타트업']) {
    await cdp.send('Input.imeSetComposition', { text: s, selectionStart: s.length, selectionEnd: s.length });
  }
  await cdp.send('Input.insertText', { text: '스타트업' });
  await expect(input).toHaveValue('스타트업');
  await expect(page.locator('.result-count')).toBeVisible();
  expect(decodeURIComponent(page.url())).toContain('q=스타트업');
});

// 2026-09-22 전체 점검에서 나온 것들
test('글에서 ← 카테고리로 돌아가면 그 분류만 보인다', async ({ page }) => {
  await page.goto('/articles/' + first);
  await page.locator('a.text-link').first().click();
  await page.waitForURL('**/articles?**');
  const cat = posts.find((p) => p.id === first).category;
  const n = posts.filter((p) => p.category === cat).length;
  await expect(page.locator('.result-count')).toContainText(String(n));
  await expect(page.locator('.filters.sub')).toBeVisible();
});

test('주소에 ?c= 만 넣어도 카테고리가 걸러진다', async ({ page }) => {
  await page.goto('/articles?c=' + encodeURIComponent('창업자-멘탈·조직'));
  const n = posts.filter((p) => p.category === '창업자-멘탈·조직').length;
  await expect(page.locator('.result-count')).toContainText(String(n));
});

test('모바일: 보고 있던 쪽을 다시 눌러도 메뉴가 닫힌다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, link] of [['/articles', '글'], ['/about', '소개'], ['/consulting#contact', '상담 문의']]) {
    await page.goto(path);
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: link, exact: link !== '상담 문의' }).click();
    await expect(page.locator('#primary-nav.is-open')).toHaveCount(0);
  }
});

test('모바일: 메뉴를 연 채 상담 문의를 눌러도 메뉴가 닫힌다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/consulting');
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.locator('#primary-nav.is-open')).toBeVisible();
  await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '상담 문의' }).click();
  await expect(page.locator('#primary-nav.is-open')).toHaveCount(0);
});

test('앵커로 이동하면 고정 헤더 바로 아래에 붙는다', async ({ page }) => {
  for (const [path, id] of [['/consulting#strategy', 'strategy'], ['/consulting#contact', 'contact'], ['/consulting#faq', 'faq']]) {
    await page.goto(path);
    await page.waitForTimeout(700);
    const top = await page.locator('#' + id).evaluate((n) => Math.round(n.getBoundingClientRect().top));
    expect(Math.abs(top - 92)).toBeLessThan(12);
  }
});

// 2026-09-22: 검색이 본문까지 훑는다 (public/search.json, 검색창을 누를 때만 내려받음)
test('글 검색이 본문까지 찾는다', async ({ page }) => {
  const requests = [];
  page.on('request', (r) => { if (r.url().includes('/search.json')) requests.push(r.url()); });
  await page.goto('/articles');
  await expect(page.locator('.post-card').first()).toBeVisible();
  expect(requests).toHaveLength(0); // 목록만 열었을 때는 받지 않는다
  // '엑셀러레이터' 는 어느 글의 제목·요약에도 없고 본문에만 있는 낱말
  await page.locator('input[type=search]').first().fill('엑셀러레이터');
  await expect(page.locator('.post-card').first()).toBeVisible({ timeout: 15000 });
  expect(requests.length).toBeGreaterThan(0);
  const n = Number((await page.locator('.result-count').innerText()).match(/(\d+)편/)[1]);
  expect(n).toBeGreaterThan(0);
});

test('검색 자료를 못 받아도 제목 검색은 된다', async ({ page }) => {
  await page.route('**/search.json', (r) => r.abort());
  await page.goto('/articles');
  await page.locator('input[type=search]').first().fill('Canva');
  await expect(page.locator('.result-count')).toContainText('1편');
});

test('제목에 있는 글이 본문에만 있는 글보다 먼저 나온다', async ({ page }) => {
  await page.goto('/articles');
  await page.locator('input[type=search]').first().fill('Canva');
  await expect(page.locator('.post-card').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.result-count')).not.toContainText('1편');
  await expect(page.locator('.post-card h3').first()).toContainText('Canva');
});
