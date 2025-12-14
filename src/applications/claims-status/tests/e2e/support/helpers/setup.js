import { ENDPOINTS } from './mocks';

const DEFAULT_CLAIM_ID = '123456789';

/**
 * Sets up a claim detail page test.
 * Intercepts the claim API endpoint, visits the claim detail page, and injects Axe.
 * @param {Object} options - Configuration options
 * @param {Object} options.claim - Claim data
 * @param {string} options.path - Path to visit (status, files, overview, needed-from-others, needed-from-you)
 * @returns {void}
 */
export const setupClaimTest = ({ claim = {}, path = 'status' } = {}) => {
  cy.intercept('GET', ENDPOINTS.CLAIM_DETAIL(DEFAULT_CLAIM_ID), {
    data: claim,
  });
  cy.visit(`/track-claims/your-claims/${DEFAULT_CLAIM_ID}/${path}`);
  cy.injectAxe();
};
