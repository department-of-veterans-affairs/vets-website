/**
 * @fileoverview VA Web Components helpers for Cypress tests
 * @module cypress-rtl-helpers/components
 */

import { TIMEOUTS, SELECTORS, MODAL_STATES } from './constants';

/**
 * Interacts with VA web components (shadow DOM)
 * @function
 * @param {string} componentSelector - The VA component selector
 * @returns {void}
 */
export const clickVA = componentSelector => {
  // VA components use click for all interactions (including checkboxes)
  cy.get(componentSelector)
    .should('exist')
    .should('be.visible')
    .click({ force: true });
};

/**
 * Verifies VA checkbox state
 * @function
 * @param {string} value - The value attribute of the checkbox
 * @param {boolean} [shouldBeChecked=true] - Whether it should be checked
 * @returns {void}
 */
export const checkboxState = (value, shouldBeChecked = true) => {
  const assertion = shouldBeChecked ? 'have.attr' : 'not.have.attr';
  cy.get(`va-checkbox[value="${value}"]`)
    .should('exist')
    .should(assertion, 'checked');
};

/**
 * Clicks a button within a VA modal
 * @function
 * @param {string} buttonText - The text of the button to click
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @throws {Error} Throws if buttonText is not provided
 * @returns {void}
 */
export const modalButton = (buttonText, options = {}) => {
  if (!buttonText) {
    throw new Error('modalButton requires buttonText');
  }
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(`${SELECTORS.VA_MODAL} button`, { timeout })
    .contains(buttonText)
    .should('be.visible')
    .click();
};

/**
 * Verifies modal visibility with improved assertions
 * @function
 * @param {boolean} [shouldBeVisible=true] - Whether the modal should be visible
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout for visibility check in milliseconds
 * @returns {void}
 */
export const modalVisible = (shouldBeVisible = true, options = {}) => {
  const { timeout = TIMEOUTS.SHORT } = options;

  if (shouldBeVisible) {
    cy.log('Verifying modal is visible');
    cy.get(SELECTORS.VA_MODAL, { timeout })
      .should('exist')
      .should('be.visible')
      .then($modal => {
        const visible = $modal.attr('visible');
        cy.wrap(MODAL_STATES.VISIBLE.includes(visible)).should(
          'be.true',
          `Modal visible attribute should be one of: ${MODAL_STATES.VISIBLE.join(
            ', ',
          )}`,
        );
      });
  } else {
    cy.log('Verifying modal is not visible');
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.VA_MODAL).length) {
        cy.get(SELECTORS.VA_MODAL).should(
          'have.attr',
          'visible',
          MODAL_STATES.HIDDEN,
        );
      } else {
        cy.get(SELECTORS.VA_MODAL).should('not.exist');
      }
    });
  }
};

/**
 * Verifies modal content
 * @function
 * @param {string[]} [expectedContent=[]] - Array of strings that should appear in the modal
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @throws {Error} Throws if expectedContent is not an array
 * @returns {void}
 */
export const modalContains = (expectedContent = [], options = {}) => {
  const { timeout = TIMEOUTS.SHORT } = options;

  if (!Array.isArray(expectedContent)) {
    throw new Error('modalContains expects an array of strings');
  }

  if (expectedContent.length === 0) {
    cy.log('Warning: No content to verify in modal');
    return;
  }

  cy.log(`Verifying modal contains ${expectedContent.length} text items`);

  expectedContent.forEach((text, index) => {
    cy.get(SELECTORS.VA_MODAL, { timeout })
      .should('contain', text)
      .then(() => {
        cy.log(
          `✓ Found text ${index + 1}/${expectedContent.length}: "${text}"`,
        );
      });
  });
};

/**
 * Verifies alert exists and contains text
 * @function
 * @param {string} status - The alert status (warning, info, error, success)
 * @param {string} [text] - Text the alert should contain
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @throws {Error} Throws if status is not provided
 * @returns {void}
 */
export const alertExists = (status, text, options = {}) => {
  if (!status) {
    throw new Error('alertExists requires a status parameter');
  }

  const { timeout = TIMEOUTS.DEFAULT } = options;

  cy.log(`Verifying ${status} alert${text ? ` with text: "${text}"` : ''}`);

  cy.get(`${SELECTORS.VA_ALERT}[status="${status}"][visible="true"]`, {
    timeout,
  })
    .should('exist')
    .and('be.visible');

  if (text) {
    cy.get(SELECTORS.VA_ALERT).should('contain', text);
  }
};
