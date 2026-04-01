const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  await page.goto('https://211227da.chorehero-help.pages.dev', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const rendered = await page.evaluate(() => ({
    sideButtons: Array.from(document.querySelectorAll('[class*="DocSearch-SidepanelButton"]')).map((el) => ({
      className: el.className,
      text: (el.textContent || '').trim(),
    })),
    searchButtons: Array.from(document.querySelectorAll('.DocSearch-Button')).map((el) => ({
      text: (el.textContent || '').trim(),
    })),
  }));

  console.log('RENDERED:', JSON.stringify(rendered, null, 2));

  const sideButton = page.locator('.DocSearch-SidepanelButton.inline').first();
  if ((await sideButton.count()) === 0) {
    console.log('No inline sidepanel button found.');
    await browser.close();
    return;
  }

  await sideButton.click();
  await page.waitForTimeout(500);

  const before = await page.evaluate(() => {
    const panel = document.querySelector('.DocSearch-Sidepanel-Container.floating.side-right');
    if (!panel) return null;
    const rect = panel.getBoundingClientRect();
    const css = getComputedStyle(panel);
    return {
      rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      position: css.position,
      transform: css.transform,
      topCss: css.top,
      rightCss: css.right,
      bottomCss: css.bottom,
      zIndex: css.zIndex,
      scrollY: window.scrollY,
    };
  });

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(400);

  const after = await page.evaluate(() => {
    const panel = document.querySelector('.DocSearch-Sidepanel-Container.floating.side-right');
    if (!panel) return null;
    const rect = panel.getBoundingClientRect();
    const css = getComputedStyle(panel);
    return {
      rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      position: css.position,
      transform: css.transform,
      topCss: css.top,
      rightCss: css.right,
      bottomCss: css.bottom,
      zIndex: css.zIndex,
      scrollY: window.scrollY,
    };
  });

  console.log('BEFORE:', JSON.stringify(before, null, 2));
  console.log('AFTER:', JSON.stringify(after, null, 2));

  await browser.close();
})();
