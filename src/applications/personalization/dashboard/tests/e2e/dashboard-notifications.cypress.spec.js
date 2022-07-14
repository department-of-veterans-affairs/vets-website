/**
 * [TestRail-integrated] Spec for My VA - On-Site-Notification
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3376
 * @testrailinfo runName MyVA On-site Notification - Debt
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  notificationsError,
  notificationSuccessDismissed,
  notificationDismissedSuccess,
  notificationsSuccessEmpty,
  notificationSuccessNotDismissed,
  multipleNotificationSuccess,
} from '../fixtures/test-notifications-response';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Notifications', () => {
  // Skipping in CI due to flakes; passes fine locally.
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });
  // TODO: Fix for CI (try local headless)
  describe('when the feature is hidden', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      }).as('featuresA');
      cy.intercept('/v0/profile/service_history', serviceHistory).as(
        'serviceA',
      );
      cy.intercept('/v0/profile/full_name', fullName).as('nameA');
      mockLocalStorage();
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresA', '@nameA', '@serviceA']);
    });
    it('the notifications does not show up - C13978', () => {
      // make sure that the Notification section is not shown
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('when the feature is not hidden', () => {
    Cypress.config({ defaultCommandTimeout: 12000 });
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.showDashboardNotifications,
              value: true,
            },
          ],
        },
      }).as('featuresB');
      cy.intercept('/v0/profile/service_history', serviceHistory).as(
        'serviceB',
      );
      cy.intercept('/v0/profile/full_name', fullName).as('nameB');
      mockLocalStorage();
    });
    it('and they have no notifications - C13979', () => {
      cy.intercept('/v0/onsite_notifications', notificationsSuccessEmpty()).as(
        'notifications1',
      );
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications1']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
    it('and they have a notification - C13025', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(),
      ).as('notifications2');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications2']);
      // cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('dashboard-notification-alert').should(
        'have.length',
        1,
      );
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they have multiple notifications - C16720', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        multipleNotificationSuccess(),
      ).as('notifications3');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications3']);
      // cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('dashboard-notification-alert').should(
        'have.length',
        2,
      );
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root'); // First AXE-check already checked the whole
    });
    it('and they have dismissed notifications - C16721', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessDismissed(),
      ).as('notifications4');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications4']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they have a notification error - C16722', () => {
      cy.intercept('/v0/onsite_notifications', notificationsError()).as(
        'notifications5',
      );
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications5']);
      cy.findByTestId('dashboard-notifications-error').should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they dismiss a notification - C16723', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(),
      ).as('notifications6');
      cy.intercept(
        'PATCH',
        `v0/onsite_notifications/e4213b12-eb44-4b2f-bac5-3384fbde0b7a`,
        {
          statusCode: 200,
          body: notificationDismissedSuccess(),
          delay: 100,
        },
      ).as('patch');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@featuresB', '@nameB', '@serviceB', '@notifications6']);
      // cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('dashboard-notification-alert').should(
        'have.length',
        1,
      );
      cy.get('va-alert')
        .shadow()
        .find('button.va-alert-close')
        .click({ waitForAnimations: true });
      cy.wait('@patch');
      cy.findByTestId('dashboard-notifications').should('not.exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
  });
});
