/* eslint-disable @department-of-veterans-affairs/axe-check-required */
/**
 * Test to verify the HCA routing bug fix.
 *
 * BUG: Logged-in users clicking "Start application"
 * were routed to /id-form, which then redirected them back to /introduction,
 * creating a redirect loop.
 *
 * ROOT CAUSE:
 * 1. FormData['view:isLoggedIn'] was not set when prefillsAvailable was empty
 * 2. IdentityPage redirected logged-in users to '/' instead of next valid page
 *
 * FIXES:
 * 1. prefillTransformer always sets 'view:isLoggedIn' from Redux state
 * 2. IdentityPage redirects to getNextPagePath() instead of '/'
 *
 * EXPECTED: /introduction -> /check-your-personal-information (skipping /id-form)
 */

import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/user.noPrefill.json';
import { setupForAuth } from './utils';

describe('HCA Routing Bug - Logged-in user with no prefill data', () => {
  beforeEach(() => setupForAuth({ user: mockUser }));

  it('should skip identity verification and go directly to personal information page for logged-in users', () => {
    cy.location('pathname').should('include', '/introduction');
    cy.clickStartForm();

    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );
    cy.location('pathname').should('not.include', '/introduction');
  });

  it('should not create a redirect loop if user lands on identity page while logged in', () => {
    cy.visit(`${manifest.rootUrl}/id-form`);
    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );
    cy.location('pathname').should('not.include', '/id-form');
  });
});
