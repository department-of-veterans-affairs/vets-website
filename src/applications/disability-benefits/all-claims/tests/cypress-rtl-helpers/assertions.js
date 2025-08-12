/**
 * @fileoverview Assertion helpers for Cypress tests
 * @module cypress-rtl-helpers/assertions
 */

/**
 * Helper to verify text content exists on the page
 * @param {string} text - The text to verify
 */
export const verifyTextExists = text => {
  cy.findByText(new RegExp(text, 'i')).should('exist');
};
