/**
 * Playwright VA web component interaction helpers.
 *
 * These helpers mirror the Cypress custom commands in
 * cypress/support/commands/webComponents.js, adapted for Playwright's
 * async/await API and native shadow DOM support.
 *
 * Playwright pierces shadow DOM natively when using locators, so there's
 * no need for the .shadow().find() pattern used in Cypress.
 */

/**
 * Fills a va-text-input web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute of the va-text-input
 * @param {string|number} value - Value to enter
 */
async function fillVaTextInput(page, name, value) {
  if (value === undefined) return;
  const vaInput = page.locator(`va-text-input[name="${name}"]`);
  if ((await vaInput.count()) === 0) return;
  const strValue = value.toString();
  const input = vaInput.locator('input');
  await input.click();
  await input.clear();
  if (strValue !== '') {
    await input.fill(strValue);
  }
}

/**
 * Fills a va-textarea web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute of the va-textarea
 * @param {string} value - Value to enter
 */
async function fillVaTextarea(page, name, value) {
  if (value === undefined) return;
  const strValue = value.toString();
  const textarea = page
    .locator(`va-textarea[name="${name}"]`)
    .locator('textarea');
  await textarea.clear();
  if (strValue !== '') {
    await textarea.fill(strValue);
  }
}

/**
 * Selects a va-radio-option.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} value - The value to select
 */
async function selectVaRadioOption(page, name, value) {
  if (value === undefined) return;
  await page
    .locator(`va-radio-option[name="${name}"][value="${value}"]`)
    .click();
}

/**
 * Selects a yes/no va-radio-option.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {boolean} value - true for Yes, false for No
 */
async function selectYesNoVaRadioOption(page, name, value) {
  if (value === undefined) return;
  const selection = value ? 'Y' : 'N';
  await selectVaRadioOption(page, name, selection);
}

/**
 * Selects a value in a va-select web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} value - The value to select
 */
async function selectVaSelect(page, name, value) {
  if (value === undefined) return;
  const vaSelect = page.locator(`va-select[name="${name}"]`);
  if ((await vaSelect.count()) === 0) return;
  const strValue = value.toString();
  const select = vaSelect.locator('select');
  await select.selectOption(strValue);
}

/**
 * Checks or unchecks a va-checkbox web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {boolean} isChecked - Whether the checkbox should be checked
 */
async function selectVaCheckbox(page, name, isChecked) {
  if (isChecked === undefined) return;
  const vaCheckbox = page.locator(`va-checkbox[name="${name}"]`);
  if ((await vaCheckbox.count()) === 0) return;
  await vaCheckbox.evaluate((el, checked) => {
    if (el.checked !== checked) {
      el.checked = checked; // eslint-disable-line no-param-reassign
      el.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked },
          bubbles: true,
        }),
      );
    }
  }, isChecked);
}

/**
 * Fills a va-memorable-date web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {boolean} [useMonthSelect=true] - Whether month uses a select
 */
async function fillVaMemorableDate(
  page,
  name,
  dateString,
  useMonthSelect = true,
) {
  if (dateString === undefined) return;
  const [year, month, day] = dateString.split('-');

  const dateLocator = page.locator(`va-memorable-date[name="${name}"]`);

  if (useMonthSelect) {
    const monthSelect = dateLocator.locator('select').first();
    await monthSelect.selectOption(parseInt(month, 10).toString());
  } else {
    const monthInput = dateLocator.locator(
      'va-text-input.memorable-date-month input',
    );
    await monthInput.fill(parseInt(month, 10).toString());
  }

  const dayInput = dateLocator.locator(`input[name="${name}Day"]`);
  await dayInput.fill(parseInt(day, 10).toString());

  const yearInput = dateLocator.locator(`input[name="${name}Year"]`);
  await yearInput.fill(year);
}

/**
 * Fills a va-date web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} dateString - Date in YYYY-MM-DD format
 */
async function fillVaDate(page, name, dateString) {
  if (dateString === undefined) return;
  const [year, month, day] = dateString.split('-');

  const dateLocator = page.locator(`va-date[name="${name}"]`);
  const monthSelect = dateLocator.locator('select.date-month');
  const daySelect = dateLocator.locator('select.date-day');
  const yearInput = dateLocator.locator('input.date-year');

  await monthSelect.selectOption(parseInt(month, 10).toString());
  if (day && day !== 'XX') {
    await daySelect.selectOption(parseInt(day, 10).toString());
  }
  await yearInput.fill(year);
}

/**
 * Fills a va-telephone-input web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {Object} value - Object with { contact } property
 */
async function fillVaTelephoneInput(page, name, value) {
  if (value === undefined) return;
  const telephoneLocator = page.locator(`va-telephone-input[name="${name}"]`);
  const innerTextInput = telephoneLocator.locator('va-text-input input');
  await innerTextInput.click();
  await innerTextInput.clear();
  await innerTextInput.fill(value.contact);
}

/**
 * Selects a value in a va-combo-box web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} value - The value to select
 */
async function selectVaComboBox(page, name, value) {
  if (value === undefined) return;
  const strValue = value.toString();
  const comboBox = page.locator(`va-combo-box[name="${name}"]`);
  const input = comboBox.locator('input');
  await input.click();
  await input.clear();

  // Find the option text for this value from the select element
  const optionText = await comboBox
    .locator(`select option[value="${strValue}"]`)
    .textContent();
  await input.fill(optionText.trim());
  await input.press('Enter');
}

/**
 * Fills a va-file-input web component by uploading a test file.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - The name attribute
 * @param {string} filePath - Path to the file to upload
 */
async function fillVaFileInput(page, name, filePath) {
  // Try va-file-input first; fall back to va-file-input-multiple
  let container = page.locator(`va-file-input[name="${name}"]`);
  if ((await container.count()) === 0) {
    container = page.locator(`va-file-input-multiple[name="${name}"]`);
  }
  if ((await container.count()) === 0) return;

  const fileInput = container.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);

  // Explicitly dispatch change event — shadow DOM boundaries may prevent
  // the event dispatched by setInputFiles from reaching the component handler
  await fileInput.evaluate(el => {
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Wait for the upload to be processed (file name or delete button appears)
  try {
    await container
      .locator('va-button-icon[button-type="delete"]')
      .first()
      .waitFor({ timeout: 5000 });
  } catch {
    // Upload indicator may not appear — continue anyway
  }
}

/**
 * Clicks the primary button in a va-button-pair.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} [name] - Optional name attribute to scope the selector
 */
async function clickVaButtonPairPrimary(page, name) {
  const selector = `va-button-pair${name ? `[name="${name}"]` : ''}`;
  const primaryButton = page
    .locator(selector)
    .locator('va-button:not([secondary]):not([back])')
    .first();
  await primaryButton.click();
}

/**
 * Clicks the secondary (back) button in a va-button-pair.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} [name] - Optional name attribute to scope the selector
 */
async function clickVaButtonPairSecondary(page, name) {
  const selector = `va-button-pair${name ? `[name="${name}"]` : ''}`;
  const secondaryButton = page
    .locator(selector)
    .locator('va-button[secondary], va-button[back]')
    .first();
  await secondaryButton.click();
}

/**
 * Fills a va-statement-of-truth web component.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} options
 * @param {string} [options.field] - Optional name attribute to scope the selector
 * @param {string} [options.fullName] - Name to enter in the text input
 * @param {boolean} [options.checked] - Whether to check the certification checkbox
 */
async function fillVaStatementOfTruth(page, { field, fullName, checked } = {}) {
  let locator;
  if (!field) {
    locator = page.locator('va-statement-of-truth');
  } else {
    locator = page.locator(`va-statement-of-truth[name="${field}"]`);
  }

  if (fullName) {
    const input = locator.locator('va-text-input input');
    await input.click();
    await input.clear();
    await input.fill(fullName);
  }
  if (typeof checked === 'boolean') {
    await locator.locator('va-checkbox').evaluate((el, isChecked) => {
      if (el.checked !== isChecked) {
        el.checked = isChecked; // eslint-disable-line no-param-reassign
        el.dispatchEvent(
          new CustomEvent('vaChange', {
            detail: { checked: isChecked },
            bubbles: true,
          }),
        );
      }
    }, checked);
  }
}

/**
 * Checks whether the current page uses VA web components.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
async function checkWebComponent(page) {
  return page.evaluate(() => {
    const selectors = [
      'va-text-input',
      'va-textarea',
      'va-select',
      'va-checkbox',
      'va-radio-option',
      'va-date',
      'va-memorable-date',
      'va-button',
      'va-card',
    ];
    return selectors.some(sel => document.querySelector(sel) !== null);
  });
}

/**
 * Fills fields inside a va-card container for single-page array items.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} fields - Field data to fill
 * @param {number} index - The current item index
 * @param {Function} fillFieldsInVaCard - Callback that fills the fields
 * @param {number} numItems - Total number of items
 */
async function fillFieldsInVaCardIfNeeded(
  page,
  fields,
  index,
  fillFieldsInVaCard,
  numItems,
) {
  const isFirstItem = index === 0;
  const isLastItem = index === numItems - 1;

  if (isFirstItem) {
    await fillFieldsInVaCard(fields, index);
  } else {
    const vaCard = page.locator('va-card');
    if ((await vaCard.count()) > 0) {
      await fillFieldsInVaCard(fields, index);
    }
  }

  if (!isLastItem) {
    await page.locator('button.va-growable-add-btn').click();
  }
}

/**
 * Helper to determine whether to add another array item based on test data
 * vs existing cards on the page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector for the element with data-array-path
 * @param {boolean} [overrideValue] - Optional override
 * @param {Object} testData - The test data object
 * @returns {Promise<boolean>} Whether to add another item
 */
async function shouldAddArrayItem(page, selector, overrideValue, testData) {
  if (typeof overrideValue === 'boolean') return overrideValue;

  const element = page.locator(selector).first();
  const arrayPath = await element.getAttribute('data-array-path');
  if (!arrayPath || !testData) return false;

  const arrayData = testData[arrayPath] || [];
  const arrayLength = Array.isArray(arrayData) ? arrayData.length : 0;
  const cardCount = await page.locator('va-card').count();
  return arrayLength > cardCount;
}

/**
 * Selects Yes/No for array builder summary page conditionally.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} testData - The test data object
 * @param {boolean} [overrideValue] - Optional override
 */
async function selectArrayBuilderSummaryYesNo(page, testData, overrideValue) {
  const shouldSelect = await shouldAddArrayItem(
    page,
    '.wc-pattern-array-builder-yes-no',
    overrideValue,
    testData,
  );
  const element = page.locator('.wc-pattern-array-builder-yes-no').first();
  const fieldName = await element.getAttribute('name');
  await selectYesNoVaRadioOption(page, fieldName, shouldSelect);
}

/**
 * Clicks array builder summary add button conditionally.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} testData - The test data object
 * @param {boolean} [overrideValue] - Optional override
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function clickArrayBuilderSummaryAddButton(
  page,
  testData,
  overrideValue,
) {
  const shouldClick = await shouldAddArrayItem(
    page,
    '.wc-pattern-array-builder-summary-add-button',
    overrideValue,
    testData,
  );
  if (shouldClick) {
    await page
      .locator('.wc-pattern-array-builder-summary-add-button')
      .first()
      .click();
    return { abortProcessing: true };
  }
  return { abortProcessing: false };
}

/**
 * Clicks array builder summary add link conditionally.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} testData - The test data object
 * @param {boolean} [overrideValue] - Optional override
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function clickArrayBuilderSummaryAddLink(page, testData, overrideValue) {
  const shouldClick = await shouldAddArrayItem(
    page,
    '.wc-pattern-array-builder-summary-add-link',
    overrideValue,
    testData,
  );
  if (shouldClick) {
    await page
      .locator('.wc-pattern-array-builder-summary-add-link')
      .first()
      .click();
    return { abortProcessing: true };
  }
  return { abortProcessing: false };
}

/**
 * General-purpose array builder summary continue that auto-detects pattern type
 * (yes/no radio, button, or link) and applies the appropriate interaction.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} testData - The test data object
 * @param {boolean} [overrideValue] - Optional override
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function arrayBuilderSummaryContinue(page, testData, overrideValue) {
  const hasYesNoRadio =
    (await page.locator('.wc-pattern-array-builder-yes-no').count()) > 0;
  if (hasYesNoRadio) {
    await selectArrayBuilderSummaryYesNo(page, testData, overrideValue);
    return { abortProcessing: false };
  }

  const hasButton =
    (await page
      .locator('.wc-pattern-array-builder-summary-add-button')
      .count()) > 0;
  if (hasButton) {
    return clickArrayBuilderSummaryAddButton(page, testData, overrideValue);
  }

  const hasLink =
    (await page.locator('.wc-pattern-array-builder-summary-add-link').count()) >
    0;
  if (hasLink) {
    return clickArrayBuilderSummaryAddLink(page, testData, overrideValue);
  }

  return { abortProcessing: false };
}

/**
 * Fills an address pattern using web components.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} fieldName - The field name prefix
 * @param {Object} addressObject - Address data
 */
async function fillAddressWebComponentPattern(page, fieldName, addressObject) {
  if (!addressObject) return;

  await selectVaCheckbox(
    page,
    `root_${fieldName}_isMilitary`,
    addressObject.isMilitary,
  );

  if (addressObject.city) {
    if (addressObject.isMilitary) {
      // Check if city is a radio or select
      const cityRadio = page.locator(`va-radio[name="root_${fieldName}_city"]`);
      if ((await cityRadio.count()) > 0) {
        await selectVaRadioOption(
          page,
          `root_${fieldName}_city`,
          addressObject.city,
        );
      } else {
        await selectVaSelect(
          page,
          `root_${fieldName}_city`,
          addressObject.city,
        );
      }
    } else {
      await fillVaTextInput(page, `root_${fieldName}_city`, addressObject.city);
    }
  }

  await selectVaSelect(
    page,
    `root_${fieldName}_country`,
    addressObject.country,
  );
  await fillVaTextInput(page, `root_${fieldName}_street`, addressObject.street);
  await fillVaTextInput(
    page,
    `root_${fieldName}_street2`,
    addressObject.street2,
  );
  await fillVaTextInput(
    page,
    `root_${fieldName}_street3`,
    addressObject.street3,
  );

  // State field may appear conditionally after country is selected;
  // wait briefly for it to render before attempting to fill.
  if (addressObject.state) {
    if (addressObject.isMilitary) {
      // Military addresses render state as va-radio (AA, AE, AP)
      const stateRadio = page.locator(
        `va-radio[name="root_${fieldName}_state"]`,
      );
      try {
        await stateRadio.waitFor({ timeout: 3000 });
      } catch {
        // State radio may not exist
      }
      if ((await stateRadio.count()) > 0) {
        await selectVaRadioOption(
          page,
          `root_${fieldName}_state`,
          addressObject.state,
        );
      }
    } else {
      const stateSelector = `va-select[name="root_${fieldName}_state"]`;
      try {
        await page.locator(stateSelector).waitFor({ timeout: 3000 });
      } catch {
        // State field may not exist for all countries
      }
      await selectVaSelect(
        page,
        `root_${fieldName}_state`,
        addressObject.state,
      );
    }
  }

  await fillVaTextInput(
    page,
    `root_${fieldName}_postalCode`,
    addressObject.postalCode,
  );
}

/**
 * Enter data into a web component field based on tag name.
 * Mirrors the Cypress enterWebComponentData command.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} field - Field descriptor { tagName, key, data, element }
 */
async function enterWebComponentData(page, field) {
  switch (field.tagName) {
    case 'VA-TEXT-INPUT':
      await fillVaTextInput(page, field.key, field.data);
      break;
    case 'VA-TEXTAREA':
      await fillVaTextarea(page, field.key, field.data);
      break;
    case 'VA-CHECKBOX':
      await selectVaCheckbox(page, field.key, field.data);
      break;
    case 'VA-COMBO-BOX':
      await selectVaComboBox(page, field.key, field.data);
      break;
    case 'VA-SELECT':
      await selectVaSelect(page, field.key, field.data);
      break;
    case 'VA-DATE':
      await fillVaDate(page, field.key, field.data);
      break;
    case 'VA-RADIO-OPTION': {
      const value = field.data;
      if (typeof value === 'boolean') {
        await selectYesNoVaRadioOption(page, field.key, value);
      } else {
        await selectVaRadioOption(page, field.key, value);
      }
      break;
    }
    case 'VA-TELEPHONE-INPUT':
      await fillVaTelephoneInput(page, field.key, field.data);
      break;
    case 'VA-MEMORABLE-DATE': {
      await fillVaMemorableDate(page, field.key, field.data);
      break;
    }
    case 'VA-FILE-INPUT':
    case 'VA-FILE-INPUT-MULTIPLE':
      // File inputs need special handling — use the example upload file
      await fillVaFileInput(
        page,
        field.key,
        'src/platform/testing/example-upload.png',
      );
      break;
    default:
      throw new Error(
        `Unknown web component type '${field.tagName}' for ${field.key}`,
      );
  }
}

module.exports = {
  fillVaTextInput,
  fillVaTextarea,
  selectVaRadioOption,
  selectYesNoVaRadioOption,
  selectVaSelect,
  selectVaCheckbox,
  fillVaMemorableDate,
  fillVaDate,
  fillVaTelephoneInput,
  selectVaComboBox,
  fillVaFileInput,
  clickVaButtonPairPrimary,
  fillAddressWebComponentPattern,
  enterWebComponentData,
  clickVaButtonPairSecondary,
  fillVaStatementOfTruth,
  checkWebComponent,
  fillFieldsInVaCardIfNeeded,
  shouldAddArrayItem,
  selectArrayBuilderSummaryYesNo,
  clickArrayBuilderSummaryAddButton,
  clickArrayBuilderSummaryAddLink,
  arrayBuilderSummaryContinue,
};
