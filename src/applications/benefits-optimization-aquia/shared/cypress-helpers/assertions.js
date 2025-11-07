/**
 * @fileoverview Assertion helpers for Cypress tests
 * @module cypress-rtl-helpers/assertions
 */

/**
 * Verifies text content exists on the page
 * @function
 * @param {string} text - The text to verify
 * @returns {void}
 */
export const textExists = text => {
  cy.findByText(new RegExp(text, 'i')).should('exist');
};
