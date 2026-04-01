const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  await page.goto('https://112f6e26.chorehero-help.pages.dev', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Ensure hero controls are hydrated.
  await page.waitForSelector('.DocSearch-Button', { timeout: 15000 });

  // Open sidepanel via inline Ask AI button.
  const askButton = page.locator('.DocSearch-SidepanelButton.inline').first();
  await askButton.waitFor({ state: 'visible', timeout: 15000 });
  await askButton.click();
  await page.waitForTimeout(700);

  const read = async () => {
    return page.evaluate(() => {
      const container = document.querySelector('.DocSearch-Sidepanel-Container') || document.querySelector('#askai-sidepanel-host');
      const panel = document.querySelector('.DocSearch-Sidepanel');
      const cRect = container ? container.getBoundingClientRect() : null;
      const pRect = panel ? panel.getBoundingClientRect() : null;
      const cCss = container ? getComputedStyle(container) : null;
      return {
        scrollY: window.scrollY,
        containerClass: container ? container.className : null,
        containerRect: cRect ? { top: cRect.top, left: cRect.left, right: cRect.right, bottom: cRect.bottom, height: cRect.height } : null,
        panelRect: pRect ? { top: pRect.top, left: pRect.left, right: pRect.right, bottom: pRect.bottom, height: pRect.height } : null,
        containerPosition: cCss ? cCss.position : null,
        containerTopCss: cCss ? cCss.top : null,
        containerTransform: cCss ? cCss.transform : null,
      };
    });
  };

  const before = await read();
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(500);
  const after = await read();

  console.log(JSON.stringify({ before, after }, null, 2));
  await browser.close();
})();
