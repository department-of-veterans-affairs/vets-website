/* eslint-disable @department-of-veterans-affairs/axe-check-required */
/**
 * Simple Cypress test to reproduce and confirm the HCA routing bug.
 *
 * BUG: Logged-in users clicking "Start application" are incorrectly routed through
 * the /id-form page (which is only for logged-out users), causing unnecessary redirects.
 *
 * EXPECTED: /introduction -> /check-your-personal-information
 * ACTUAL: /introduction -> /id-form -> / -> /introduction
 *
 * ROOT CAUSE: SaveInProgressIntro.getStartPage() returns pageList[1].path without
 * checking the page's depends condition. For HCA, pageList[1] is /id-form which has
 * depends: isLoggedOut, so it should be skipped for logged-in users.
 *
 * TRIGGER: Bug occurs when:
 * 1. User is logged in
 * 2. User's profile does NOT have prefillsAvailable for this form
 * 3. User clicks the start button (which calls goToBeginning() -> router.push(startPage))
 */

import mockUser from './fixtures/mocks/user.noPrefill.json';
import { setupForAuth, startAsAuthUser } from './utils';

const toPath = (baseHref, maybeUrl) => {
  if (!maybeUrl) return '';
  try {
    const u = maybeUrl.startsWith('http')
      ? new URL(maybeUrl)
      : new URL(maybeUrl, baseHref);
    return u.pathname;
  } catch {
    return String(maybeUrl);
  }
};

describe('HCA Routing Bug - Logged-in user incorrectly visits id-form', () => {
  let beforeLoadHandler;

  beforeEach(() => {
    // Stub pushState so every navigation is captured from the very first script
    // Use cy.spy here so we can reference it later with @push
    beforeLoadHandler = win => {
      cy.spy(win.history, 'pushState').as('push');
    };
    Cypress.on('window:before:load', beforeLoadHandler);
    setupForAuth({ user: mockUser });
  });

  afterEach(() => {
    if (beforeLoadHandler) Cypress.off('window:before:load', beforeLoadHandler);
  });

  it('should reproduce the bug: logged-in user is routed through id-form before reaching destination', () => {
    // Sanity check: we should be on `/introduction` initially
    cy.location('pathname').should('include', '/introduction');

    // Click `Start application`; utils asserts final path includes /check-your-personal-information
    startAsAuthUser({ waitForPrefill: false });

    cy.location('href').then(hrefNow => {
      cy.get('@push').then(push => {
        const navigationLog = push
          .getCalls()
          .map(c => toPath(hrefNow, c.args?.[2])) // pushState(state, title, url)
          .filter(Boolean);

        const visitedIdForm = navigationLog.some(p => p.includes('/id-form'));

        Cypress.log({
          name: visitedIdForm ? '🐛 BUG' : '✅ OK',
          message: visitedIdForm
            ? `User was incorrectly routed through /id-form. Sequence: ${navigationLog.join(
                ' → ',
              )}`
            : `User did not visit /id-form. Sequence: ${navigationLog.join(
                ' → ',
              )}`,
          consoleProps: () => ({ navigationLog }),
        });

        // This assertion will FAIL when the bug exists, confirming our diagnosis
        // When the fix is applied, this test will PASS
        expect(
          visitedIdForm,
          'Logged-in users should NOT visit /id-form (depends: isLoggedOut)',
        ).to.be.false;
      });
    });
  });
});
