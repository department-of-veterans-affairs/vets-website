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

import manifest from '../../manifest.json';
import mockEnrollmentStatus from './fixtures/mocks/enrollment-status.json';
import mockFeatures from './fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from './fixtures/mocks/maintenance-windows.json';
import mockVamc from './fixtures/mocks/vamc-ehr.json';

describe('HCA Routing Bug - Logged-in user incorrectly visits id-form', () => {
  beforeEach(() => {
    Cypress.config({ scrollBehavior: 'nearest' });

    // Set up mocks
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatures).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/maintenance_windows', mockMaintenanceWindows);
    cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);
    cy.intercept(
      'POST',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    ).as('mockEnrollmentStatus');
    cy.intercept('GET', '/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');

    // Create a user WITHOUT prefillsAvailable for 1010ez
    // This forces the use of getStartPage() instead of prefill navigation
    const userWithoutPrefill = {
      data: {
        id: '',
        type: 'users_scaffolds',
        attributes: {
          profile: {
            sign_in: { service_name: 'idme' },
            email: 'vets.gov.user+71@gmail.com',
            loa: { current: 3 },
            first_name: 'Julio',
            middle_name: 'E',
            last_name: 'Hunter',
            gender: 'M',
            birth_date: '1951-11-18',
            verified: true,
          },
          veteran_status: {
            status: 'OK',
            is_veteran: true,
          },
          inProgressForms: [],
          // NO prefillsAvailable - this is key to triggering the bug!
          prefillsAvailable: [],
          services: ['facilities', 'hca', 'user-profile'],
          va_profile: {
            status: 'OK',
            birth_date: '19511118',
            family_name: 'Hunter',
            gender: 'M',
            given_names: ['Julio', 'E'],
          },
        },
      },
    };

    // Log in with user that has NO prefillsAvailable
    cy.login(userWithoutPrefill);
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);
  });

  it('reproduces the bug: logged-in user is routed through id-form before reaching destination', () => {
    // Start on introduction page
    cy.location('pathname').should('include', '/introduction');

    // Run accessibility check

    // Spy on router.push calls to track navigation
    const navigationLog = [];

    cy.window().then(win => {
      const originalPushState = win.history.pushState;
      win.history.pushState = function pushState(state, title, url, ...args) {
        const path = url || win.location.pathname;
        navigationLog.push(path);
        return originalPushState.apply(this, [state, title, url, ...args]);
      };
    });

    // Since prefillsAvailable is empty, clicking start will call goToBeginning()
    // which uses getStartPage() - this is where the bug is!
    cy.get('[href="#start"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();

    // Wait for navigation to complete by checking the URL changes
    // cy.location('pathname', { timeout: 5000 }).should(
    // 'not.include',
    // '/introduction',
    // );
    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );

    // Check the navigation log and assert
    cy.wrap(navigationLog).then(navLog => {
      const visitedIdForm = navLog.some(
        path => path && (path.includes('id-form') || path.endsWith('id-form')),
      );

      // Log results for debugging
      if (visitedIdForm) {
        Cypress.log({
          name: '🐛 BUG',
          message: `User was incorrectly routed through /id-form. Sequence: ${navLog.join(
            ' → ',
          )}`,
          consoleProps: () => ({ navigationLog: navLog }),
        });
      } else {
        Cypress.log({
          name: '✅ OK',
          message: 'User did not visit id-form',
          consoleProps: () => ({ navigationLog: navLog }),
        });
      }

      // This assertion will FAIL when the bug exists, confirming our diagnosis
      // When the fix is applied, this test will PASS
      expect(
        visitedIdForm,
        'Logged-in users should NOT visit id-form (it has depends: isLoggedOut)',
      ).to.be.false;
    });
  });
});
