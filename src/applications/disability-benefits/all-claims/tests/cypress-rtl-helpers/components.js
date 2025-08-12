/**
 * @fileoverview VA Web Components helpers for Cypress tests
 * @module cypress-rtl-helpers/components
 */

import { TIMEOUTS, SELECTORS, MODAL_STATES } from './constants';

/**
 * Helper to interact with VA web components (shadow DOM)
 * @param {string} componentSelector - The VA component selector
 */
export const interactWithVAComponent = componentSelector => {
  // VA components use click for all interactions (including checkboxes)
  cy.get(componentSelector)
    .should('exist')
    .should('be.visible')
    .click({ force: true });
};

/**
 * Helper to verify VA checkbox state
 * @param {string} value - The value attribute of the checkbox
 * @param {boolean} shouldBeChecked - Whether it should be checked
 */
export const verifyVACheckboxState = (value, shouldBeChecked = true) => {
  const assertion = shouldBeChecked ? 'have.attr' : 'not.have.attr';
  cy.get(`va-checkbox[value="${value}"]`)
    .should('exist')
    .should(assertion, 'checked');
};

/**
 * Helper to interact with VA modal buttons
 * @param {string} buttonText - The text of the button to click
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 * @throws {Error} If buttonText is not provided
 */
export const clickModalButton = (buttonText, options = {}) => {
  if (!buttonText) {
    throw new Error('clickModalButton requires buttonText');
  }
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(`${SELECTORS.VA_MODAL} button`, { timeout })
    .contains(buttonText)
    .should('be.visible')
    .click();
};

/**
 * Helper to verify modal visibility with improved assertions
 * @param {boolean} shouldBeVisible - Whether the modal should be visible
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout for visibility check
 */
export const verifyModalVisibility = (shouldBeVisible = true, options = {}) => {
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
 * Helper to verify modal content
 * @param {string[]} expectedContent - Array of strings that should appear in the modal
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const verifyModalContent = (expectedContent = [], options = {}) => {
  const { timeout = TIMEOUTS.SHORT } = options;

  if (!Array.isArray(expectedContent)) {
    throw new Error('verifyModalContent expects an array of strings');
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
 * Helper to verify alert exists and contains text
 * @param {string} status - The alert status (warning, info, error, success)
 * @param {string} text - Text the alert should contain
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 * @throws {Error} If status is not provided
 */
export const verifyAlert = (status, text, options = {}) => {
  if (!status) {
    throw new Error('verifyAlert requires a status parameter');
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
