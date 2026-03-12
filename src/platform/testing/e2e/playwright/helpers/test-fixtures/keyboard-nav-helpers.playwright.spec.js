const { test, expect } = require('@playwright/test');
const path = require('path');

const {
  tabToElement,
  tabToElementAndPressSpace,
  typeInFocused,
  chooseRadio,
  tabToContinueForm,
  tabToInputWithLabel,
} = require('../keyboardNavigation');

const fixturePath = path.resolve(__dirname, 'keyboard-nav-fixture.html');

test.describe('Playwright keyboardNavigation integration tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${fixturePath}`);
    await page.waitForSelector('main');
  });

  test.describe('tabToElement', () => {
    test('tabs forward to target element', async ({ page }) => {
      await tabToElement(page, '#name-input');
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('name-input');
    });

    test('tabs to a deeper element', async ({ page }) => {
      await tabToElement(page, '#email-input');
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('email-input');
    });

    test('throws after MAX_TAB_ATTEMPTS for nonexistent element', async ({
      page,
    }) => {
      await expect(tabToElement(page, '#does-not-exist')).rejects.toThrow(
        'Could not tab to element',
      );
    });
  });

  test.describe('tabToElementAndPressSpace', () => {
    test('tabs to element and presses space', async ({ page }) => {
      await tabToElementAndPressSpace(page, 'button[type="submit"]');
      const focused = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(focused).toBe('BUTTON');
    });
  });

  test.describe('typeInFocused', () => {
    test('types text into focused input', async ({ page }) => {
      await tabToElement(page, '#name-input');
      await typeInFocused(page, 'John Doe');
      const value = await page.locator('#name-input').inputValue();
      expect(value).toBe('John Doe');
    });

    test('types into email input', async ({ page }) => {
      await tabToElement(page, '#email-input');
      await typeInFocused(page, 'test@example.com');
      const value = await page.locator('#email-input').inputValue();
      expect(value).toBe('test@example.com');
    });
  });

  test.describe('chooseRadio', () => {
    test('selects a radio by value using arrow keys', async ({ page }) => {
      // Focus the first radio to enter the radio group
      await page.locator('input[name="color"][value="red"]').focus();
      await chooseRadio(page, 'red');

      const focused = await page.evaluate(() => document.activeElement?.value);
      expect(focused).toBe('red');
    });

    test('does nothing for undefined value', async ({ page }) => {
      // Should return immediately without error
      await chooseRadio(page, undefined);
    });

    test('throws for non-existent radio value', async ({ page }) => {
      await page.locator('input[name="color"][value="red"]').focus();
      await expect(chooseRadio(page, 'purple')).rejects.toThrow(
        'Could not find radio option',
      );
    });
  });

  test.describe('tabToContinueForm', () => {
    test('tabs to submit button', async ({ page }) => {
      await tabToContinueForm(page);
      const focused = await page.evaluate(() => document.activeElement?.type);
      expect(focused).toBe('submit');
    });
  });

  test.describe('tabToInputWithLabel', () => {
    test('tabs to input matching label text', async ({ page }) => {
      await tabToInputWithLabel(page, 'Your name');
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('name-input');
    });

    test('tabs to email input by label', async ({ page }) => {
      await tabToInputWithLabel(page, 'Email');
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('email-input');
    });
  });
});
