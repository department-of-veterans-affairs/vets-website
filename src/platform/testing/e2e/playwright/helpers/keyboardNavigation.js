/**
 * Playwright keyboard navigation helpers.
 *
 * Port of cypress/support/commands/keyboardNavigation.js for Playwright.
 * Provides helpers for Tab-based navigation, radio/select keyboard
 * interaction, and form control focusing.
 *
 * Usage:
 *   const { tabToElement, tabToStartForm } = require('./keyboardNavigation');
 *   await tabToElement(page, '#my-input');
 *   await tabToStartForm(page);
 */

const MAX_TAB_ATTEMPTS = 200;

/**
 * Tabs forward or backward through focusable elements until the target
 * element receives focus. Reverses direction when focus enters the
 * header or footer to avoid infinite loops.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector of the target element
 * @param {boolean} [forward=true] - Tab forward (true) or backward (false)
 */
async function tabToElement(page, selector, forward = true) {
  let direction = forward;
  let attempt = 0;

  const step = async () => {
    if (attempt >= MAX_TAB_ATTEMPTS) {
      throw new Error(
        `Could not tab to element "${selector}" after ${MAX_TAB_ATTEMPTS} attempts`,
      );
    }
    attempt += 1;

    const key = direction ? 'Tab' : 'Shift+Tab';
    await page.keyboard.press(key);

    const focused = await page.evaluate(sel => {
      const el = document.activeElement;
      if (!el) return { matches: false, inHeaderFooter: false };
      return {
        matches: el.matches(sel),
        inHeaderFooter:
          el.closest('#footerNav') !== null || el.closest('header') !== null,
      };
    }, selector);

    if (focused.matches) return;
    if (focused.inHeaderFooter) direction = !direction;
    await step();
  };

  await step();
}

/**
 * Tabs to an element and presses Space.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector of the target element
 * @param {boolean} [forward=true]
 */
async function tabToElementAndPressSpace(page, selector, forward = true) {
  await tabToElement(page, selector, forward);
  await page.keyboard.press('Space');
}

/**
 * Types text into the currently focused element.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} text
 */
async function typeInFocused(page, text) {
  await page.keyboard.type(text);
}

/**
 * Selects a radio option by value using keyboard arrow keys.
 * Assumes a radio in the group is already focused.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} value - The value attribute of the target radio
 */
async function chooseRadio(page, value) {
  if (value === undefined) return;

  let attempt = 0;

  const step = async () => {
    if (attempt >= 20) {
      throw new Error(`Could not find radio option with value "${value}"`);
    }
    attempt += 1;

    const currentValue = await page.evaluate(
      () => document.activeElement?.value,
    );
    if (currentValue === value) {
      await page.keyboard.press('Space');
      return;
    }
    await page.keyboard.press('ArrowDown');
    await step();
  };

  await step();
}

/**
 * Tabs to the "Start" form button on an introduction page and presses Enter.
 *
 * @param {import('@playwright/test').Page} page
 */
async function tabToStartForm(page) {
  const startSelector =
    'button[id$="continueButton"].usa-button-primary, ' +
    '.vads-c-action-link--green[href="#start"], ' +
    'va-link-action[href="#start"]';

  await tabToElement(page, startSelector);
  await page.keyboard.press('Enter');
}

/**
 * Tabs to the Continue/Submit button and presses Space.
 *
 * @param {import('@playwright/test').Page} page
 */
async function tabToContinueForm(page) {
  await tabToElement(page, 'button[type="submit"], va-button[continue]');
  await page.keyboard.press('Space');
}

/**
 * Tabs to the Back button and presses Enter.
 *
 * @param {import('@playwright/test').Page} page
 * @param {boolean} [forward=true]
 */
async function tabToGoBack(page, forward = true) {
  await tabToElement(page, '#1-continueButton, va-button[back]', forward);
  await page.keyboard.press('Enter');
}

module.exports = {
  tabToElement,
  tabToElementAndPressSpace,
  typeInFocused,
  chooseRadio,
  tabToStartForm,
  tabToContinueForm,
  tabToGoBack,
};
