/**
 * Custom Cypress command for URL assertions.
 *
 * Provides a host-agnostic way to assert URLs, treating localhost and 127.0.0.1 as equivalent.
 * This addresses Node 22 DNS resolution changes that prefer IPv6 over IPv4.
 */

import { normalizeTestUrl } from '../url-utils';

/**
 * Asserts that the current URL matches the expected URL.
 * Normalizes localhost/127.0.0.1 differences for consistent behavior.
 *
 * @example
 * // Works correctly regardless of whether baseUrl is localhost or 127.0.0.1
 * cy.assertUrl('/my-health/inbox/');
 * cy.assertUrl('http://localhost:3001/my-health/inbox/'); // Also works with full URLs
 *
 * @param {string} expectedUrl - The expected URL (can be path or full URL)
 */
Cypress.Commands.add('assertUrl', expectedUrl => {
  const baseUrl = Cypress.config('baseUrl');

  // If it's a relative path, prepend the base URL
  const fullExpectedUrl = expectedUrl.startsWith('http')
    ? expectedUrl
    : `${baseUrl}${expectedUrl}`;

  cy.url().then(actualUrl => {
    // Normalize both URLs to use 127.0.0.1 for comparison
    const normalizedActual = normalizeTestUrl(actualUrl);
    const normalizedExpected = normalizeTestUrl(fullExpectedUrl);

    expect(normalizedActual).to.eq(normalizedExpected);
  });
});

/**
 * Asserts that the current URL includes the expected string.
 * Normalizes localhost/127.0.0.1 differences for consistent behavior.
 *
 * @example
 * cy.assertUrlIncludes('/my-health/inbox/');
 *
 * @param {string} expectedSubstring - The substring expected in the URL
 */
Cypress.Commands.add('assertUrlIncludes', expectedSubstring => {
  cy.url().then(actualUrl => {
    const normalizedActual = normalizeTestUrl(actualUrl);
    const normalizedExpected = normalizeTestUrl(expectedSubstring);

    expect(normalizedActual).to.include(normalizedExpected);
  });
});
