import {
  ENDPOINTS,
  mockAppealsEndpoint,
  mockClaimLettersEndpoint,
} from './mocks';

const DEFAULT_CLAIM_ID = '123456789';
const DEFAULT_APPEAL_ID = '987654321';

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

/**
 * Sets up a claim letters page test.
 * Intercepts the claim letters API endpoint, visits the page, and injects Axe.
 * @param {Object} options - Configuration options
 * @param {Array} options.letters - Array of claim letter objects
 * @param {number} options.statusCode - HTTP status code to return (default: 200)
 * @returns {void}
 */
export const setupClaimLettersTest = ({
  letters = [],
  statusCode = 200,
} = {}) => {
  mockClaimLettersEndpoint(letters, statusCode);
  cy.visit('/track-claims/your-claim-letters');
  cy.injectAxe();
};

/**
 * Sets up an appeal detail page test.
 * Intercepts the appeals API endpoint, visits the appeal detail page, and injects Axe.
 * @param {Object} options - Configuration options
 * @param {Object} options.appeal - Appeal data object
 * @param {string} options.path - Path to visit (status, detail) - default: 'status'
 * @returns {void}
 */
export const setupAppealTest = ({ appeal = {}, path = 'status' } = {}) => {
  mockAppealsEndpoint([appeal]);
  cy.visit(`/track-claims/appeals/${DEFAULT_APPEAL_ID}/${path}`);
  cy.injectAxe();
};
