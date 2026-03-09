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
};
