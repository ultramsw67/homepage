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
  expect(await page.content()).not.toContain('더문테크');
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
  await page.goto('/articles');
  await expect(page.locator('.post-card').first()).toBeVisible();
  await expect(page.locator('.result-count')).toContainText(String(posts.length));
  await page.getByRole('button', { name: 'Founder Mindset', exact: true }).click();
  const fm = posts.filter((p) => p.category === 'Founder-Mindset').length;
  await expect(page.locator('.result-count')).toContainText(String(fm));
  await page.getByRole('button', { name: /^전체/ }).click();
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
