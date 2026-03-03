/**
 * Test URL utilities for Cypress E2E tests.
 *
 * These utilities help avoid hardcoding localhost URLs in tests,
 * making tests work correctly in both local development and CI environments.
 *
 * Background: Node 22 changed DNS resolution to prefer IPv6 (::1) over IPv4 (127.0.0.1)
 * when resolving "localhost". In CI environments, this causes connection failures
 * because the test server binds to IPv4. Using 127.0.0.1 explicitly avoids this issue.
 *
 * The baseUrl is configured in config/test-server.config.js and used by Cypress.
 */

/**
 * Gets the base URL from Cypress configuration.
 * Use this instead of hardcoding 'http://localhost:3001'.
 *
 * @example
 * // Instead of:
 * cy.visit('http://localhost:3001/my-page');
 *
 * // Use:
 * cy.visit(`${getBaseUrl()}/my-page`);
 * // Or simply:
 * cy.visit('/my-page'); // Cypress automatically prepends baseUrl
 *
 * @returns {string} The configured base URL (e.g., 'http://localhost:3001')
 */
export const getBaseUrl = () => Cypress.config('baseUrl');

/**
 * Builds a full test URL from a path.
 * Use this for assertions that need the full URL.
 *
 * @example
 * expect(win.location.href).to.eq(getTestUrl('/my-health/inbox/'));
 *
 * @param {string} path - The path to append to the base URL
 * @returns {string} The full URL (e.g., 'http://localhost:3001/my-health/inbox/')
 */
export const getTestUrl = path => `${getBaseUrl()}${path}`;

/**
 * Normalizes a URL by replacing localhost with 127.0.0.1.
 * Useful for comparing URLs that may use either form.
 *
 * @param {string} url - The URL to normalize
 * @returns {string} The normalized URL with 127.0.0.1 instead of localhost
 */
export const normalizeTestUrl = url =>
  url ? url.replace(/localhost/g, '127.0.0.1') : url;

/**
 * Checks if two URLs are equivalent, treating localhost and 127.0.0.1 as the same.
 *
 * @param {string} url1 - First URL to compare
 * @param {string} url2 - Second URL to compare
 * @returns {boolean} True if URLs are equivalent
 */
export const urlsAreEquivalent = (url1, url2) =>
  normalizeTestUrl(url1) === normalizeTestUrl(url2);
