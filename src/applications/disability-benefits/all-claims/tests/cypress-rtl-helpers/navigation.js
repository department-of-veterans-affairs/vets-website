/**
 * @fileoverview Navigation helpers for Cypress tests
 * @module cypress-rtl-helpers/navigation
 */

import { TIMEOUTS, SELECTORS } from './constants';

/**
 * Helper to click Continue button using RTL patterns
 * Prioritizes accessible queries over implementation details
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const clickContinue = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.findByRole(SELECTORS.CONTINUE_BUTTON, { name: /continue/i, timeout })
    .should('be.visible')
    .should('be.enabled')
    .click();
};

/**
 * Helper to click Back button using RTL patterns
 */
export const clickBack = () => {
  cy.findByRole('button', { name: /back/i }).click();
};

/**
 * Helper to navigate through standard form pages that just need Continue
 * @param {string[]} pageNames - Array of page names for logging/documentation
 */
export const navigateThroughPages = (pageNames = []) => {
  pageNames.forEach(pageName => {
    cy.log(`Navigating through: ${pageName}`);
    clickContinue();
  });
};

/**
 * Helper to wait for and verify navigation to a specific page
 * @param {string} pathInclude - Part of the path to check for
 * @param {number} timeout - Timeout in milliseconds
 * @throws {Error} If pathInclude is not provided
 */
export const waitForPageNavigation = (
  pathInclude,
  timeout = TIMEOUTS.DEFAULT,
) => {
  if (!pathInclude) {
    throw new Error('waitForPageNavigation requires a pathInclude parameter');
  }

  cy.log(`Waiting for navigation to: ${pathInclude}`);
  cy.location('pathname', { timeout }).should('include', pathInclude);
};

/**
 * Helper to navigate past the wizard
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const skipWizard = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(SELECTORS.SKIP_WIZARD, { timeout })
    .should('be.visible')
    .click();
};

/**
 * Helper to start the disability compensation application
 * Uses accessible link finding
 */
export const startApplication = () => {
  cy.findAllByRole('link', {
    name: /start the disability compensation application/i,
  })
    .first()
    .should('be.visible')
    .click();
};

/**
 * Helper to navigate to the toxic exposure conditions page
 * Handles the standard flow to get there
 */
export const navigateToToxicExposureConditions = () => {
  // This would typically involve the full navigation flow
  // but can be customized based on prefill data
  cy.log('Navigating to toxic exposure conditions page');
};
