import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';

import {
  makeUserObject,
  mockLocalStorage,
  getUserPreferencesOneSelected,
} from './dashboard-e2e-helpers';

describe('MyVA Dashboard', () => {
  describe('when user should see all available widgets', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: true,
        rx: true,
        facilities: [{ facilityId: '618', isCerner: false }],
        inProgressForms: [
          {
            form: '40-10007',
            metadata: {
              version: 0,
              returnUrl: '/preparer',
              savedAt: 1602619612576,
              // a date 7 days in the future, in seconds
              expiresAt: Date.now() / 1000 + 7 * 24 * 60 * 60,
              lastUpdated: 1602619612,
              inProgressFormId: 4950,
            },
            lastUpdated: 1602619612,
          },
        ],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route('GET', '/v0/user/preferences', getUserPreferencesOneSelected);
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
    });
    it('should show all the available widgets', () => {
      cy.visit('my-va/');

      // The COVID-19 alert shows up
      cy.findByText(
        /You may be eligible to use health chat as part of our pilot/i,
      ).should('exist');
      // The preferences widget shows the homeless alert and the selected
      // preference
      cy.findByTestId('preferences-widget')
        .should(
          'contain.text',
          'If you’re homeless or at risk of becoming homeless',
        )
        .should('contain.text', 'With VA health care');
      cy.findByRole('heading', { name: 'Your applications' }).should('exist');
      cy.findByRole('heading', {
        name: /^Application for pre-need determination/,
      }).should('exist');
      cy.findByRole('heading', { name: 'Manage your VA health care' }).should(
        'exist',
      );
      cy.findByRole('heading', {
        name: 'You are enrolled in VA Health Care',
      }).should('exist');
      cy.findByRole('heading', {
        name: 'Check secure messages',
      }).should('exist');
      cy.findByRole('heading', {
        name: 'Refill prescriptions',
      }).should('exist');
      cy.findByRole('heading', {
        name: 'Schedule an appointment',
      }).should('exist');

      cy.findByRole('heading', {
        name: 'Explore our most used benefits',
      }).should('not.exist');

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
