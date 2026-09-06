import { test, expect } from '@playwright/test';
for(const width of [390,768,1440]){
 test('responsive routes at '+width,async({page})=>{
  await page.setViewportSize({width,height:1000});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/about','/consulting','/articles','/articles/1','/missing','/articles/missing']){
   await page.goto(path);await expect(page.locator('h1')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   await expect.poll(() => page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBeTruthy();
  }
  expect(errors).toEqual([]);
 });
}
test('mobile menu and consultation anchor',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const menu=page.getByRole('button',{name:'메뉴 열기'});await menu.click();
 await expect(page.getByRole('button',{name:'메뉴 닫기'})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('link',{name:'프로젝트 이야기하기'}).click();
 await expect(page).toHaveURL(/consulting#contact/);
 await expect(page.locator('#contact')).toBeInViewport();
 await expect(page.getByRole('button',{name:'메뉴 열기'})).toHaveAttribute('aria-expanded','false');
 await expect(page.locator('#name')).toBeVisible();
 expect(await page.locator('form').evaluate(f=>f.checkValidity())).toBeFalsy();
 await page.locator('#name').fill('검증용 팀');await page.locator('#email').fill('test@example.com');await page.locator('#message').fill('MVP 검증 상담 테스트');
 expect(await page.locator('form').evaluate(f=>f.checkValidity())).toBeTruthy();
});
test('journal filters, search and reading',async({page})=>{
 await page.goto('/articles');await expect(page.locator('.article-row')).toHaveCount(4);
 await page.getByRole('button',{name:'Product',exact:true}).click();await expect(page.locator('.article-row')).toHaveCount(1);
 await page.getByRole('button',{name:'전체',exact:true}).click();await page.getByRole('searchbox').fill('피치덱');await expect(page.locator('.article-row')).toHaveCount(1);
 await page.locator('.article-row').click();await expect(page.locator('.article-body')).toBeVisible();
 await page.goto('/articles');await page.getByRole('searchbox').fill('존재하지않는주제');await expect(page.getByRole('status')).toContainText('검색 결과가 없습니다');
});
test('review screenshots',async({page})=>{
 await page.setViewportSize({width:1440,height:1050});await page.goto('/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'tmp/home-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.screenshot({path:'tmp/home-mobile.png',fullPage:true});
 await page.goto('/consulting');await page.screenshot({path:'tmp/consulting-mobile.png',fullPage:true});
});

