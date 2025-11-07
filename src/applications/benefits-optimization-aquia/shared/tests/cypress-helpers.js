/**
 * @module shared/tests/cypress-helpers
 * @description RTL-inspired Cypress helpers for BIO forms
 *
 * These helpers provide a consistent, reliable way to interact with BIO custom components
 * and va-* web components in Cypress tests.
 */

/**
 * Fill a va-text-input web component
 * @param {string} name - The name attribute of the input
 * @param {string} value - The value to type
 */
export const fillTextInput = (name, value) => {
  if (!value) return;
  cy.get(`va-text-input[name="${name}"]`)
    .shadow()
    .find('input')
    .clear();
  cy.get(`va-text-input[name="${name}"]`)
    .shadow()
    .find('input')
    .type(value);
};

/**
 * Fill a va-memorable-date web component
 * @param {string} name - The name attribute of the date field
 * @param {string} dateString - Date in YYYY-MM-DD format
 */
export const fillMemorableDate = (name, dateString) => {
  if (!dateString) return;
  cy.get(`va-memorable-date[name="${name}"]`).then($el => {
    const element = $el[0];
    element.value = dateString;
    // Trigger change event to notify the form
    element.dispatchEvent(new Event('dateChange', { bubbles: true }));
  });
};

/**
 * Fill a va-textarea web component
 * @param {string} name - The name attribute of the textarea
 * @param {string} value - The value to type
 */
export const fillTextarea = (name, value) => {
  if (!value) return;
  cy.get(`va-textarea[name="${name}"]`)
    .shadow()
    .find('textarea')
    .clear();
  cy.get(`va-textarea[name="${name}"]`)
    .shadow()
    .find('textarea')
    .type(value);
};

/**
 * Select a radio option (va-radio with va-radio-option children)
 * @param {string} label - The label text of the radio group (or use selectRadioByValue for direct selection)
 * @param {string} value - The value to select
 */
export const selectRadio = (label, value) => {
  if (!value && value !== false) return;
  // Find the va-radio by its label, then find the va-radio-option with matching value
  cy.contains('va-radio', label)
    .find(`va-radio-option[value="${value}"]`)
    .shadow()
    .find('input')
    .click({ force: true });
};

/**
 * Select a radio option by value directly (when you can't rely on label)
 * @param {string} value - The value to select
 */
export const selectRadioByValue = value => {
  if (!value && value !== false) return;
  cy.get(`va-radio-option[value="${value}"]`).click({ force: true });
};

/**
 * Select a radio option and trigger React state update
 * This method directly sets the value on the va-radio component and dispatches
 * the custom event that React listens for, ensuring state updates properly.
 * Use this for forms where radio selection triggers conditional rendering.
 * @param {string} value - The value to select
 * @param {number} waitTime - Optional wait time in ms for conditional fields to render (default: 500)
 */
export const selectRadioAndWait = (value, waitTime = 500) => {
  if (!value && value !== false) return;
  cy.get('va-radio').then($radio => {
    const radioElement = $radio[0];
    radioElement.value = value;
    const event = new CustomEvent('vaValueChange', {
      detail: { value },
      bubbles: true,
    });
    radioElement.dispatchEvent(event);
  });
  // Wait for React to process state change and render conditional fields
  cy.wait(waitTime); // eslint-disable-line cypress/no-unnecessary-waiting
};

/**
 * Check or uncheck a va-checkbox component
 * @param {string} name - The name attribute of the checkbox
 * @param {boolean} checked - True to check, false to uncheck
 */
export const setCheckbox = (name, checked) => {
  if (checked === undefined || checked === null) return;
  cy.get(`va-checkbox[name="${name}"]`)
    .shadow()
    .find('input[type="checkbox"]')
    .then($checkbox => {
      const isCurrentlyChecked = $checkbox.prop('checked');
      if (isCurrentlyChecked !== checked) {
        cy.wrap($checkbox).click({ force: true });
      }
    });
};

/**
 * Fill an address using BIO AddressField component
 * @param {string} prefix - The field name prefix (e.g., 'employerAddress')
 * @param {Object} address - Address object with street, city, state, postalCode, etc.
 */
export const fillAddress = (prefix, address) => {
  if (!address) return;

  if (address.street) {
    fillTextInput(`${prefix}.street`, address.street);
  }
  if (address.street2) {
    fillTextInput(`${prefix}.street2`, address.street2);
  }
  if (address.street3) {
    fillTextInput(`${prefix}.street3`, address.street3);
  }
  if (address.city) {
    fillTextInput(`${prefix}.city`, address.city);
  }
  if (address.state) {
    cy.get(`select[name="${prefix}.state"]`).select(address.state);
  }
  if (address.postalCode) {
    fillTextInput(`${prefix}.postalCode`, address.postalCode);
  }
  if (address.country) {
    cy.get(`select[name="${prefix}.country"]`).select(address.country);
  }
};

/**
 * Click the Continue button on BIO custom page template
 */
export const clickContinue = () => {
  cy.get('va-button[text="Continue"]').click();
};

/**
 * Click the Back button on BIO custom page template
 */
export const clickBack = () => {
  cy.get('va-button[text="Back"]').click();
};

/**
 * Click the Update button on BIO review page
 */
export const clickUpdate = () => {
  cy.get('va-button[text="Update"]').click();
};

/**
 * Fill a form page using BIO components
 * Automatically detects field types and fills them appropriately
 * @param {Object} data - Object with field names as keys and values
 */
export const fillBIOPage = data => {
  if (!data) return;

  Object.entries(data).forEach(([fieldName, value]) => {
    if (!value && value !== false) return;

    // Try to find the field and determine its type
    cy.get(`[name="${fieldName}"]`).then($el => {
      const tagName = $el[0]?.tagName?.toLowerCase();

      if (tagName === 'va-text-input') {
        fillTextInput(fieldName, value);
      } else if (tagName === 'va-textarea') {
        fillTextarea(fieldName, value);
      } else if (tagName === 'va-memorable-date') {
        fillMemorableDate(fieldName, value);
      } else if (tagName === 'va-radio') {
        selectRadio(fieldName, value);
      } else if (tagName === 'select') {
        cy.get(`select[name="${fieldName}"]`).select(value);
      } else if (tagName === 'input') {
        cy.get(`input[name="${fieldName}"]`).clear();
        cy.get(`input[name="${fieldName}"]`).type(value);
      }
    });
  });
};

/**
 * Create page hooks for BIO forms
 * Returns an object with afterHook functions that fill fields and click continue
 * @param {Object} pageDataMap - Map of page paths to their data objects
 * @returns {Object} Page hooks object for use in Cypress testConfig
 */
export const createBIOPageHooks = pageDataMap => {
  const hooks = {};

  Object.entries(pageDataMap).forEach(([pagePath, getData]) => {
    hooks[pagePath] = ({ afterHook }) => {
      afterHook(() => {
        cy.get('@testData').then(testData => {
          const data =
            typeof getData === 'function' ? getData(testData) : getData;
          fillBIOPage(data);
          clickContinue();
        });
      });
    };
  });

  return hooks;
};

/**
 * Fill veteran information page (common pattern)
 * @param {Object} data - Test data object
 */
export const fillVeteranInformation = data => {
  const vetInfo = data.veteranInformation;
  if (!vetInfo) return;

  fillTextInput('firstName', vetInfo.firstName);
  fillTextInput('lastName', vetInfo.lastName);
  fillMemorableDate('dateOfBirth', vetInfo.dateOfBirth);
};

/**
 * Fill veteran contact information page (common pattern)
 * @param {Object} data - Test data object
 */
export const fillVeteranContactInformation = data => {
  const contactInfo = data.veteranContactInformation;
  if (!contactInfo) return;

  fillTextInput('ssn', contactInfo.ssn);
  if (contactInfo.vaFileNumber) {
    fillTextInput('vaFileNumber', contactInfo.vaFileNumber);
  }
};
