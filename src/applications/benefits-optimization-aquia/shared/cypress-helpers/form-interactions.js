/**
 * @fileoverview Form interaction helpers for Cypress tests
 * @module cypress-rtl-helpers/form-interactions
 */

import { TIMEOUTS, SELECTORS } from './constants';
import { next } from './navigation';

/**
 * Selects a radio option by its label text
 * Uses accessible queries instead of value attributes
 * @function
 * @param {string} labelText - The label text for the radio button
 * @returns {void}
 */
export const selectRadio = labelText => {
  cy.findByLabelText(new RegExp(labelText, 'i')).click();
};

/**
 * Fills a text input by its label
 * @function
 * @param {string} labelText - The label text for the input
 * @param {string} value - The value to type
 * @returns {void}
 */
export const fillText = (labelText, value) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).clear();
  cy.findByLabelText(new RegExp(labelText, 'i')).type(value);
};

/**
 * Fills a textarea by its label
 * @function
 * @param {string} labelText - The label text for the textarea
 * @param {string} value - The value to type
 * @returns {void}
 */
export const fillTextarea = (labelText, value) => {
  cy.findByRole('textbox', { name: new RegExp(labelText, 'i') }).type(value);
};

/**
 * Selects an option from a dropdown by label
 * @function
 * @param {string} labelText - The label text for the select
 * @param {string} optionText - The option to select
 * @returns {void}
 */
export const selectOption = (labelText, optionText) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).select(optionText);
};

/**
 * Checks a checkbox using accessible queries
 * @function
 * @param {string} labelText - The label text for the checkbox
 * @returns {void}
 */
export const check = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).check();
};

/**
 * Unchecks a checkbox using accessible queries
 * @function
 * @param {string} labelText - The label text for the checkbox
 * @returns {void}
 */
export const uncheck = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).uncheck();
};

/**
 * Selects "No" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @function
 * @param {Object} [options={}] - Optional configuration
 * @param {string} [options.selector] - Custom selector if needed
 * @param {boolean} [options.force=true] - Force click even if element is covered
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @returns {void}
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
 * Selects "Yes" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @function
 * @param {Object} [options={}] - Optional configuration
 * @param {string} [options.selector] - Custom selector if needed
 * @param {boolean} [options.force=true] - Force click even if element is covered
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @returns {void}
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
 * Selects radio options by value
 * More reliable than label-based selection for VA forms
 * @function
 * @param {string} value - The value attribute of the radio button
 * @returns {void}
 */
export const selectValue = value => {
  cy.get(`input[type="radio"][value="${value}"]`)
    .first()
    .check({ force: true });
};

/**
 * Fills service period dates
 * @function
 * @param {Object} dates - Object containing service dates
 * @param {string} [dates.branch] - Service branch name
 * @param {Object} [dates.from] - Start date object
 * @param {string} [dates.from.month] - Start month
 * @param {string} [dates.from.day] - Start day
 * @param {string} [dates.from.year] - Start year
 * @param {Object} [dates.to] - End date object
 * @param {string} [dates.to.month] - End month
 * @param {string} [dates.to.day] - End day
 * @param {string} [dates.to.year] - End year
 * @param {number} [periodIndex=0] - Index of the service period
 * @returns {void}
 */
export const fillService = (dates, periodIndex = 0) => {
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
 * Fills out the condition follow-up flow
 * @function
 * @param {string} cause - The cause type (NEW, SECONDARY, WORSENED, VA)
 * @param {string} description - The description text
 * @throws {Error} Throws if cause or description is not provided
 * @returns {void}
 */
export const fillCondition = (cause, description) => {
  const validCauses = ['NEW', 'SECONDARY', 'WORSENED', 'VA'];

  if (!cause || !validCauses.includes(cause)) {
    throw new Error(
      `fillCondition requires a valid cause: ${validCauses.join(', ')}`,
    );
  }

  if (!description) {
    throw new Error('fillCondition requires a description');
  }

  cy.log(`Filling condition follow-up: cause=${cause}`);

  // Select the cause
  cy.get(`input[value="${cause}"]`)
    .should('exist')
    .check({ force: true });
  next();

  // Fill description
  cy.get('textarea[id="root_primaryDescription"]')
    .should('be.visible')
    .type(description);
  next();
};
