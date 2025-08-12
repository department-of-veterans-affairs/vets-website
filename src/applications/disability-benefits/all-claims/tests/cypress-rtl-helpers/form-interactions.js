/**
 * @fileoverview Form interaction helpers for Cypress tests
 * @module cypress-rtl-helpers/form-interactions
 */

import { TIMEOUTS, SELECTORS } from './constants';
import { clickContinue } from './navigation';

/**
 * Helper to select a radio option by its label text
 * Uses accessible queries instead of value attributes
 * @param {string} labelText - The label text for the radio button
 */
export const selectRadioOption = labelText => {
  cy.findByLabelText(new RegExp(labelText, 'i')).click();
};

/**
 * Helper to fill a text input by its label
 * @param {string} labelText - The label text for the input
 * @param {string} value - The value to type
 */
export const fillTextInput = (labelText, value) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).clear();
  cy.findByLabelText(new RegExp(labelText, 'i')).type(value);
};

/**
 * Helper to fill a textarea by its label
 * @param {string} labelText - The label text for the textarea
 * @param {string} value - The value to type
 */
export const fillTextarea = (labelText, value) => {
  cy.findByRole('textbox', { name: new RegExp(labelText, 'i') }).type(value);
};

/**
 * Helper to select an option from a dropdown by label
 * @param {string} labelText - The label text for the select
 * @param {string} optionText - The option to select
 */
export const selectDropdownOption = (labelText, optionText) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).select(optionText);
};

/**
 * Helper to check a checkbox using accessible queries
 * @param {string} labelText - The label text for the checkbox
 */
export const checkCheckbox = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).check();
};

/**
 * Helper to uncheck a checkbox using accessible queries
 * @param {string} labelText - The label text for the checkbox
 */
export const uncheckCheckbox = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).uncheck();
};

/**
 * Helper to select "No" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @param {object} options - Optional configuration
 * @param {string} options.selector - Custom selector if needed
 * @param {boolean} options.force - Force click even if element is covered
 * @param {number} options.timeout - Custom timeout
 */
export const selectNo = (options = {}) => {
  const { selector, force = true, timeout = TIMEOUTS.SHORT } = options;

  cy.log('Selecting "No" option');

  if (selector) {
    cy.get(selector, { timeout })
      .should('exist')
      .click({ force });
    return;
  }

  // Try different selectors in order of preference
  cy.get('body').then($body => {
    for (const sel of SELECTORS.RADIO_NO) {
      if ($body.find(sel).length) {
        cy.log(`Found "No" radio with selector: ${sel}`);
        cy.get(sel)
          .first()
          .should('exist')
          .click({ force });
        return;
      }
    }

    // Try ID fallback
    if ($body.find('input[id*="No"]').length) {
      cy.log('Found "No" radio with id containing "No"');
      cy.get('input[id*="No"]')
        .first()
        .should('exist')
        .click({ force });
      return;
    }

    // Fallback to label click
    cy.log('Using label fallback for "No" selection');
    cy.get('label')
      .contains(/^no$/i)
      .should('exist')
      .click({ force });
  });
};

/**
 * Helper to select "Yes" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @param {object} options - Optional configuration
 * @param {string} options.selector - Custom selector if needed
 * @param {boolean} options.force - Force click even if element is covered
 * @param {number} options.timeout - Custom timeout
 */
export const selectYes = (options = {}) => {
  const { selector, force = true, timeout = TIMEOUTS.SHORT } = options;

  cy.log('Selecting "Yes" option');

  if (selector) {
    cy.get(selector, { timeout })
      .should('exist')
      .click({ force });
    return;
  }

  // Try different selectors in order of preference
  cy.get('body').then($body => {
    for (const sel of SELECTORS.RADIO_YES) {
      if ($body.find(sel).length) {
        cy.log(`Found "Yes" radio with selector: ${sel}`);
        cy.get(sel)
          .first()
          .should('exist')
          .click({ force });
        return;
      }
    }

    // Try ID fallback
    if ($body.find('input[id*="Yes"]').length) {
      cy.log('Found "Yes" radio with id containing "Yes"');
      cy.get('input[id*="Yes"]')
        .first()
        .should('exist')
        .click({ force });
      return;
    }

    // Fallback to label click
    cy.log('Using label fallback for "Yes" selection');
    cy.get('label')
      .contains(/^yes$/i)
      .should('exist')
      .click({ force });
  });
};

/**
 * Helper to select radio options by value
 * More reliable than label-based selection for VA forms
 * @param {string} value - The value attribute of the radio button
 */
export const selectRadioByValue = value => {
  cy.get(`input[type="radio"][value="${value}"]`)
    .first()
    .check({ force: true });
};

/**
 * Helper to fill service period dates
 * @param {object} dates - Object containing service dates
 * @param {number} periodIndex - Index of the service period (default 0)
 */
export const fillServicePeriod = (dates, periodIndex = 0) => {
  const idPrefix = `#root_serviceInformation_servicePeriods_${periodIndex}`;

  if (dates.branch) {
    cy.get(`${idPrefix}_serviceBranch`).select(dates.branch);
  }

  if (dates.from) {
    if (dates.from.month) {
      cy.get(`${idPrefix}_dateRange_fromMonth`).select(dates.from.month);
    }
    if (dates.from.day) {
      cy.get(`${idPrefix}_dateRange_fromDay`).select(dates.from.day);
    }
    if (dates.from.year) {
      cy.get(`${idPrefix}_dateRange_fromYear`).clear();
      cy.get(`${idPrefix}_dateRange_fromYear`).type(dates.from.year);
    }
  }

  if (dates.to) {
    if (dates.to.month) {
      cy.get(`${idPrefix}_dateRange_toMonth`).select(dates.to.month);
    }
    if (dates.to.day) {
      cy.get(`${idPrefix}_dateRange_toDay`).select(dates.to.day);
    }
    if (dates.to.year) {
      cy.get(`${idPrefix}_dateRange_toYear`).clear();
      cy.get(`${idPrefix}_dateRange_toYear`).type(dates.to.year);
    }
  }
};

/**
 * Helper to fill out the condition follow-up flow
 * @param {string} cause - The cause type (NEW, SECONDARY, WORSENED, VA)
 * @param {string} description - The description text
 * @throws {Error} If cause or description is not provided
 */
export const fillConditionFollowUp = (cause, description) => {
  const validCauses = ['NEW', 'SECONDARY', 'WORSENED', 'VA'];

  if (!cause || !validCauses.includes(cause)) {
    throw new Error(
      `fillConditionFollowUp requires a valid cause: ${validCauses.join(', ')}`,
    );
  }

  if (!description) {
    throw new Error('fillConditionFollowUp requires a description');
  }

  cy.log(`Filling condition follow-up: cause=${cause}`);

  // Select the cause
  cy.get(`input[value="${cause}"]`)
    .should('exist')
    .check({ force: true });
  clickContinue();

  // Fill description
  cy.get('textarea[id="root_primaryDescription"]')
    .should('be.visible')
    .type(description);
  clickContinue();
};
