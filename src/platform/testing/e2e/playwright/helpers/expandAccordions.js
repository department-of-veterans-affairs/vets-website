/**
 * Playwright helper to expand all accordion and additional-info web components.
 *
 * Port of cypress/support/commands/expandAccordions.js for Playwright.
 * Useful before running axeCheck to ensure all content is visible.
 *
 * Usage:
 *   const { expandAccordions } = require('./expandAccordions');
 *   await expandAccordions(page);
 */

/**
 * Expands all va-accordion-item, va-additional-info, and collapsed button
 * elements within the main content area. Runs in a single browser evaluate
 * call to avoid sequential awaits.
 *
 * @param {import('@playwright/test').Page} page
 */
async function expandAccordions(page) {
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return;

    // Expand va-accordion-item shadow buttons
    main.querySelectorAll('va-accordion-item').forEach(item => {
      const btn = item.shadowRoot?.querySelector(
        'button[aria-expanded="false"]',
      );
      if (btn) btn.click();
    });

    // Expand va-additional-info shadow triggers
    main.querySelectorAll('va-additional-info').forEach(info => {
      const trigger = info.shadowRoot?.querySelector(
        'a[role="button"][aria-expanded="false"]',
      );
      if (trigger) trigger.click();
    });

    // Expand any remaining collapsed buttons
    main
      .querySelectorAll('button[aria-expanded="false"]')
      .forEach(btn => btn.click());
  });
}

module.exports = { expandAccordions };
