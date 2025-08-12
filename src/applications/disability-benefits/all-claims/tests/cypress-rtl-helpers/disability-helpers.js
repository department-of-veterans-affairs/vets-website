/**
 * @fileoverview Disability-specific helpers for Cypress tests
 * @module cypress-rtl-helpers/disability-helpers
 */

import { TIMEOUTS, SELECTORS } from './constants';

/**
 * Helper to add a new disability condition with improved error handling
 * @param {string} condition - The condition name
 * @param {number} index - The index of the condition (default 0)
 * @throws {Error} If condition is not provided
 */
export const addDisabilityCondition = (condition, index = 0) => {
  if (!condition) {
    throw new Error('addDisabilityCondition requires a condition name');
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
