/**
 * Test server configuration.
 *
 * This module provides a single source of truth for test server URLs.
 * It addresses Node 22's DNS resolution changes that prefer IPv6 (::1)
 * over IPv4 (127.0.0.1) when resolving "localhost", which can cause
 * connection failures in CI environments.
 *
 * To switch between localhost and 127.0.0.1, change TEST_SERVER_HOST below.
 *
 * Usage in Cypress tests:
 *   const baseUrl = Cypress.config('baseUrl');
 *   // Or use the getTestUrl helper from support/url-utils.js
 */

// The hostname for the test server. Use '127.0.0.1' for Node 22+ compatibility
// in CI environments, or 'localhost' for local development if preferred.
const TEST_SERVER_HOST = '127.0.0.1';
const TEST_SERVER_PORT = 3001;

const TEST_SERVER_BASE_URL = `http://${TEST_SERVER_HOST}:${TEST_SERVER_PORT}`;

module.exports = {
  TEST_SERVER_HOST,
  TEST_SERVER_PORT,
  TEST_SERVER_BASE_URL,
};
