/**
 * @fileoverview Disability-specific helpers for Cypress tests
 * @module cypress-rtl-helpers/disability-helpers
 */

import { TIMEOUTS, SELECTORS } from './constants';

/**
 * Adds a new disability condition with improved error handling
 * @function
 * @param {string} condition - The condition name
 * @param {number} [index=0] - The index of the condition
 * @throws {Error} Throws if condition is not provided
 * @returns {void}
 */
export const addCondition = (condition, index = 0) => {
  if (!condition) {
    throw new Error('addCondition requires a condition name');
  }

  cy.log(`Adding disability condition: ${condition}`);

  // Type in the autocomplete field
  cy.get(`#root_newDisabilities_${index}_condition`)
    .shadow()
    .find('input')
    .should('be.visible')
    .type(condition);

  // Wait for and select the first option
  cy.get('[role="option"]', { timeout: TIMEOUTS.SHORT })
    .first()
    .should('be.visible')
    .click();

  // Save the condition
  cy.get(`${SELECTORS.VA_BUTTON}[text="Save"]`)
    .should('be.visible')
    .click();
};
