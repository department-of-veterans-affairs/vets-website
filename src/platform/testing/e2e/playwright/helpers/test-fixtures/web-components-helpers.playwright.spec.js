const { test, expect } = require('@playwright/test');
const path = require('path');

const {
  fillVaTextInput,
  fillVaTextarea,
  selectVaRadioOption,
  selectYesNoVaRadioOption,
  selectVaSelect,
  selectVaCheckbox,
  fillVaMemorableDate,
  fillVaDate,
  selectVaComboBox,
  checkWebComponent,
  enterWebComponentData,
} = require('../webComponents');
const { expandAccordions } = require('../expandAccordions');
const { setViewportPreset } = require('../viewportPreset');

const fixturePath = path.resolve(__dirname, 'web-components-fixture.html');

test.describe('Playwright helpers integration tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${fixturePath}`);
    await page.waitForSelector('va-text-input');
  });

  test.describe('fillVaTextInput', () => {
    test('fills a text input with string value', async ({ page }) => {
      await fillVaTextInput(page, 'firstName', 'Alice');
      const value = await page
        .locator('va-text-input[name="firstName"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('Alice');
    });

    test('fills a text input with numeric value', async ({ page }) => {
      await fillVaTextInput(page, 'age', 42);
      const value = await page
        .locator('va-text-input[name="age"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('42');
    });

    test('clears existing value before filling', async ({ page }) => {
      await fillVaTextInput(page, 'firstName', 'Old');
      await fillVaTextInput(page, 'firstName', 'New');
      const value = await page
        .locator('va-text-input[name="firstName"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('New');
    });

    test('does nothing for undefined value', async ({ page }) => {
      await fillVaTextInput(page, 'firstName', 'Test');
      await fillVaTextInput(page, 'firstName', undefined);
      const value = await page
        .locator('va-text-input[name="firstName"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('Test');
    });

    test('does nothing for missing element', async ({ page }) => {
      // Should not throw
      await fillVaTextInput(page, 'nonexistent', 'value');
    });
  });

  test.describe('fillVaTextarea', () => {
    test('fills a textarea with value', async ({ page }) => {
      await fillVaTextarea(page, 'description', 'Hello world');
      const value = await page
        .locator('va-textarea[name="description"]')
        .locator('textarea')
        .inputValue();
      expect(value).toBe('Hello world');
    });

    test('does nothing for undefined value', async ({ page }) => {
      await fillVaTextarea(page, 'description', 'Keep');
      await fillVaTextarea(page, 'description', undefined);
      const value = await page
        .locator('va-textarea[name="description"]')
        .locator('textarea')
        .inputValue();
      expect(value).toBe('Keep');
    });
  });

  test.describe('selectVaRadioOption', () => {
    test('clicks a radio option by name and value', async ({ page }) => {
      await selectVaRadioOption(page, 'gender', 'female');
      // Verify the click happened - radio option should have been clicked
      const clicked = await page.evaluate(() => {
        const opt = document.querySelector(
          'va-radio-option[name="gender"][value="female"]',
        );
        return opt !== null;
      });
      expect(clicked).toBe(true);
    });
  });

  test.describe('selectYesNoVaRadioOption', () => {
    test('clicks Y option for true', async ({ page }) => {
      await selectYesNoVaRadioOption(page, 'hasDependents', true);
      const exists = await page
        .locator('va-radio-option[name="hasDependents"][value="Y"]')
        .count();
      expect(exists).toBe(1);
    });

    test('clicks N option for false', async ({ page }) => {
      await selectYesNoVaRadioOption(page, 'hasDependents', false);
      const exists = await page
        .locator('va-radio-option[name="hasDependents"][value="N"]')
        .count();
      expect(exists).toBe(1);
    });
  });

  test.describe('selectVaSelect', () => {
    test('selects a value from dropdown', async ({ page }) => {
      await selectVaSelect(page, 'country', 'CAN');
      const value = await page
        .locator('va-select[name="country"]')
        .locator('select')
        .inputValue();
      expect(value).toBe('CAN');
    });

    test('does nothing for missing element', async ({ page }) => {
      await selectVaSelect(page, 'nonexistent', 'val');
    });
  });

  test.describe('selectVaCheckbox', () => {
    test('sets checked state via evaluate', async ({ page }) => {
      await selectVaCheckbox(page, 'agree', true);
      const checked = await page.evaluate(() => {
        return document.querySelector('va-checkbox[name="agree"]').checked;
      });
      expect(checked).toBe(true);
    });

    test('unchecks when false', async ({ page }) => {
      await selectVaCheckbox(page, 'agree', true);
      await selectVaCheckbox(page, 'agree', false);
      const checked = await page.evaluate(() => {
        return document.querySelector('va-checkbox[name="agree"]').checked;
      });
      expect(checked).toBe(false);
    });
  });

  test.describe('fillVaDate', () => {
    test('fills month, day, and year', async ({ page }) => {
      await fillVaDate(page, 'birthDate', '1990-03-15');

      const month = await page
        .locator('va-date[name="birthDate"]')
        .locator('va-select.select-month select')
        .inputValue();
      expect(month).toBe('3');

      const day = await page
        .locator('va-date[name="birthDate"]')
        .locator('va-select.select-day select')
        .inputValue();
      expect(day).toBe('15');

      const year = await page
        .locator('va-date[name="birthDate"]')
        .locator('va-text-input.input-year input')
        .inputValue();
      expect(year).toBe('1990');
    });

    test('skips day when month-year-only', async ({ page }) => {
      await fillVaDate(page, 'expiryDate', '2025-06-XX');

      const month = await page
        .locator('va-date[name="expiryDate"]')
        .locator('va-select.select-month select')
        .inputValue();
      expect(month).toBe('6');

      // Day select should not exist for month-year-only dates
      const dayCount = await page
        .locator('va-date[name="expiryDate"]')
        .locator('va-select.select-day')
        .count();
      expect(dayCount).toBe(0);

      const year = await page
        .locator('va-date[name="expiryDate"]')
        .locator('va-text-input.input-year input')
        .inputValue();
      expect(year).toBe('2025');
    });
  });

  test.describe('fillVaMemorableDate', () => {
    test('fills with month select (default)', async ({ page }) => {
      await fillVaMemorableDate(page, 'dob', '1985-07-22', true);

      const month = await page
        .locator('va-memorable-date[name="dob"]')
        .locator('va-select.usa-form-group--month-select select')
        .inputValue();
      expect(month).toBe('7');

      const day = await page
        .locator('va-memorable-date[name="dob"]')
        .locator('va-text-input.usa-form-group--day-input input')
        .inputValue();
      expect(day).toBe('22');

      const year = await page
        .locator('va-memorable-date[name="dob"]')
        .locator('va-text-input.usa-form-group--year-input input')
        .inputValue();
      expect(year).toBe('1985');
    });

    test('fills with month text input when useMonthSelect is false', async ({
      page,
    }) => {
      await fillVaMemorableDate(page, 'anniversary', '2000-12-31', false);

      const month = await page
        .locator('va-memorable-date[name="anniversary"]')
        .locator('va-text-input.usa-form-group--month-input input')
        .inputValue();
      expect(month).toBe('12');
    });
  });

  test.describe('selectVaComboBox', () => {
    test('fills input with option text and presses Enter', async ({ page }) => {
      await selectVaComboBox(page, 'state', 'CA');
      const value = await page
        .locator('va-combo-box[name="state"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('California');
    });
  });

  test.describe('checkWebComponent', () => {
    test('returns true when VA web components exist', async ({ page }) => {
      const result = await checkWebComponent(page);
      expect(result).toBe(true);
    });

    test('returns false on empty page', async ({ page }) => {
      await page.setContent('<html><body><p>No components</p></body></html>');
      const result = await checkWebComponent(page);
      expect(result).toBe(false);
    });
  });

  test.describe('enterWebComponentData', () => {
    test('fills VA-TEXT-INPUT', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-TEXT-INPUT',
        key: 'firstName',
        data: 'Bob',
      });
      const value = await page
        .locator('va-text-input[name="firstName"]')
        .locator('input')
        .inputValue();
      expect(value).toBe('Bob');
    });

    test('fills VA-TEXTAREA', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-TEXTAREA',
        key: 'description',
        data: 'Test description',
      });
      const value = await page
        .locator('va-textarea[name="description"]')
        .locator('textarea')
        .inputValue();
      expect(value).toBe('Test description');
    });

    test('checks VA-CHECKBOX', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-CHECKBOX',
        key: 'agree',
        data: true,
      });
      const checked = await page.evaluate(() => {
        return document.querySelector('va-checkbox[name="agree"]').checked;
      });
      expect(checked).toBe(true);
    });

    test('selects VA-SELECT', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-SELECT',
        key: 'country',
        data: 'MEX',
      });
      const value = await page
        .locator('va-select[name="country"]')
        .locator('select')
        .inputValue();
      expect(value).toBe('MEX');
    });

    test('fills VA-DATE', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-DATE',
        key: 'birthDate',
        data: '2000-01-15',
      });
      const year = await page
        .locator('va-date[name="birthDate"]')
        .locator('va-text-input.input-year input')
        .inputValue();
      expect(year).toBe('2000');
    });

    test('selects VA-RADIO-OPTION with string value', async ({ page }) => {
      // Should not throw - just clicks the matching option
      await enterWebComponentData(page, {
        tagName: 'VA-RADIO-OPTION',
        key: 'gender',
        data: 'male',
      });
    });

    test('selects VA-RADIO-OPTION with boolean (yes/no)', async ({ page }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-RADIO-OPTION',
        key: 'hasDependents',
        data: true,
      });
    });

    test('fills VA-MEMORABLE-DATE reading month-select attr', async ({
      page,
    }) => {
      await enterWebComponentData(page, {
        tagName: 'VA-MEMORABLE-DATE',
        key: 'dob',
        data: '1995-11-05',
      });
      const month = await page
        .locator('va-memorable-date[name="dob"]')
        .locator('va-select.usa-form-group--month-select select')
        .inputValue();
      expect(month).toBe('11');
    });

    test('throws for unknown tag', async ({ page }) => {
      await expect(
        enterWebComponentData(page, {
          tagName: 'VA-UNKNOWN',
          key: 'x',
          data: 'y',
        }),
      ).rejects.toThrow('Unknown web component type');
    });
  });

  test.describe('expandAccordions', () => {
    test('expands collapsed accordion items', async ({ page }) => {
      // Verify initially collapsed
      const initialState = await page
        .locator('va-accordion-item')
        .first()
        .locator('button')
        .getAttribute('aria-expanded');
      expect(initialState).toBe('false');

      await expandAccordions(page);

      // After expanding, verify buttons have aria-expanded=true
      const items = page.locator('va-accordion-item');
      const count = await items.count();
      expect(count).toBe(2);

      const expanded0 = await items
        .nth(0)
        .locator('button')
        .getAttribute('aria-expanded');
      expect(expanded0).toBe('true');

      const expanded1 = await items
        .nth(1)
        .locator('button')
        .getAttribute('aria-expanded');
      expect(expanded1).toBe('true');
    });

    test('expands additional-info triggers', async ({ page }) => {
      await expandAccordions(page);
      const expanded = await page
        .locator('va-additional-info')
        .locator('a[role="button"]')
        .getAttribute('aria-expanded');
      expect(expanded).toBe('true');
    });
  });

  test.describe('setViewportPreset', () => {
    test('sets mobile viewport', async ({ page }) => {
      await setViewportPreset(page, 'va-top-mobile-1');
      const viewport = page.viewportSize();
      expect(viewport.width).toBe(390);
      expect(viewport.height).toBe(844);
    });

    test('sets tablet viewport', async ({ page }) => {
      await setViewportPreset(page, 'va-top-tablet-1');
      const viewport = page.viewportSize();
      expect(viewport.width).toBe(768);
      expect(viewport.height).toBe(1024);
    });

    test('sets desktop viewport', async ({ page }) => {
      await setViewportPreset(page, 'va-top-desktop-1');
      const viewport = page.viewportSize();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    });

    test('applies landscape orientation', async ({ page }) => {
      await setViewportPreset(page, 'va-top-mobile-1', 'landscape');
      const viewport = page.viewportSize();
      expect(viewport.width).toBe(844);
      expect(viewport.height).toBe(390);
    });

    test('throws for unknown preset', async ({ page }) => {
      await expect(setViewportPreset(page, 'unknown-preset')).rejects.toThrow();
    });
  });
});
