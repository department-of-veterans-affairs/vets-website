import enrollmentStatusNotInESR from '@@profile/tests/fixtures/enrollment-system/not-in-esr.json';
import error500 from '@@profile/tests/fixtures/500.json';

import {
  makeUserObject,
  mockLocalStorage,
  getUserPreferencesEmpty,
} from './dashboard-e2e-helpers';

describe('MyVA Dashboard', () => {
  describe('when user should see the minimal amount of widgets', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: false,
        rx: false,
        facilities: [],
        inProgressForms: [
          // a single SIP form that has expired, so this should not be shown in
          // the UI
          {
            form: '40-10007',
            metadata: {
              version: 0,
              returnUrl: '/preparer',
              savedAt: 1602619612576,
              // a date one week in the past, in seconds
              expiresAt: Date.now() / 1000 - 7 * 24 * 60 * 60,
              lastUpdated: 1602619612,
              inProgressFormId: 4950,
            },
            lastUpdated: 1602619612,
          },
        ],
        isPatient: false,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.intercept('GET', '/v0/user/preferences', getUserPreferencesEmpty);
      cy.intercept(
        'GET',
        '/notifications/dismissed_statuses/form_10_10ez',
        error500,
      );
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusNotInESR,
      );
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');

      // should show a loading indicator
      cy.findByRole('progressbar').should('exist');

      // and then the loading indicator should be removed
      cy.findByRole('progressbar').should('not.exist');

      cy.findByText(
        /You may be eligible to use health chat as part of our pilot/i,
      ).should('not.exist');
      // Shows the preference widget empty state
      cy.findByTestId('preferences-widget')
        .should(
          'contain.text',
          'You haven’t selected any benefits to learn about',
        )
        .should(
          'not.contain.text',
          'If you’re homeless or at risk of becoming homeless',
        );

      cy.findByRole('heading', { name: 'Your applications' }).should(
        'not.exist',
      );

      cy.findByRole('heading', {
        name: /^Application for pre-need determination/,
      }).should('not.exist');

      cy.findByRole('heading', { name: 'Manage your VA health care' }).should(
        'not.exist',
      );

      cy.findByRole('heading', {
        name: 'You are enrolled in VA Health Care',
      }).should('not.exist');

      cy.findByRole('heading', {
        name: 'Check secure messages',
      }).should('not.exist');

      cy.findByRole('heading', {
        name: 'Refill prescriptions',
      }).should('not.exist');

      cy.findByRole('heading', {
        name: 'Schedule an appointment',
      }).should('not.exist');

      cy.findByRole('heading', {
        name: 'Explore our most used benefits',
      }).should('exist');

      cy.findByRole('heading', {
        name: 'Manage benefits or request records',
      }).should('exist');

      cy.findByRole('heading', {
        name: 'View your profile',
      }).should('exist');

      cy.findByRole('link', {
        name: 'Go to your profile',
      }).should('exist');
    });
  });
});
