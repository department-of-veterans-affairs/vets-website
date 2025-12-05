/**
 * Sets up a claim detail page test.
 * Intercepts the claim API endpoint, visits the claim detail page, and injects Axe.
 * @param {Object} options - Configuration options
 * @param {Object} options.claim - Claim data
 * @param {string} options.path - Path to visit (status, files, overview, needed-from-others, needed-from-you)
 * @returns {void}
 */
export const setupClaimTest = ({ claim = {}, path = 'status' } = {}) => {
  cy.intercept('GET', '/v0/benefits_claims/123456789', { data: claim });
  cy.visit(`/track-claims/your-claims/123456789/${path}`);
  cy.injectAxe();
};
