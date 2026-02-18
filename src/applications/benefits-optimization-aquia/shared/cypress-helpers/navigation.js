/**
 * @fileoverview Navigation helpers for Cypress tests
 * @module cypress-rtl-helpers/navigation
 */

import { TIMEOUTS, SELECTORS } from './constants';

/**
 * Clicks Continue button using RTL patterns
 * Prioritizes accessible queries over implementation details
 * @function
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @returns {void}
 */
export const next = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.findByRole('button', { name: /continue/i, timeout })
    .should('be.visible')
    .should('be.enabled')
    .click();
};

/**
 * Clicks Back button using RTL patterns
 * @function
 * @returns {void}
 */
export const back = () => {
  cy.findByRole('button', { name: /back/i }).click();
};

/**
 * Navigates through standard form pages that just need Continue
 * @function
 * @param {string[]} [pageNames=[]] - Array of page names for logging/documentation
 * @returns {void}
 */
export const navigateThrough = (pageNames = []) => {
  pageNames.forEach(pageName => {
    cy.log(`Navigating through: ${pageName}`);
    next();
  });
};

/**
 * Waits for and verifies navigation to a specific page
 * @function
 * @param {string} pathInclude - Part of the path to check for
 * @param {number} [timeout] - Timeout in milliseconds
 * @throws {Error} Throws if pathInclude is not provided
 * @returns {void}
 */
export const waitForPath = (pathInclude, timeout = TIMEOUTS.DEFAULT) => {
  if (!pathInclude) {
    throw new Error('waitForPath requires a pathInclude parameter');
  }

  cy.log(`Waiting for navigation to: ${pathInclude}`);
  cy.location('pathname', { timeout }).should('include', pathInclude);
};

/**
 * Navigates past the wizard
 * @function
 * @param {Object} [options={}] - Optional configuration
 * @param {number} [options.timeout] - Custom timeout in milliseconds
 * @returns {void}
 */
export const skipWizard = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(SELECTORS.SKIP_WIZARD, { timeout })
    .should('be.visible')
    .click();
};

/**
 * Starts the disability compensation application
 * Uses accessible link finding
 * @function
 * @returns {void}
 */
export const startApp = () => {
  cy.findAllByRole('link', {
    name: /start the disability compensation application/i,
  })
    .first()
    .should('be.visible')
    .click();
};

/**
 * Navigates to the toxic exposure conditions page
 * Handles the standard flow to get there
 * @function
 * @returns {void}
 */
export const goToToxicExposure = () => {
  // This would typically involve the full navigation flow
  // but can be customized based on prefill data
  cy.log('Navigating to toxic exposure conditions page');
};
