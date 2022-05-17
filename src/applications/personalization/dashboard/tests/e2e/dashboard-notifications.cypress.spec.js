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
  notificationsSuccessEmpty,
  notificationSuccessNotDismissed,
  multipleNotificationSuccess,
} from '../fixtures/test-notifications-response';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Notifications', () => {
  describe('when the feature is hidden', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      });
      mockLocalStorage();
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.intercept('/v0/profile/service_history', serviceHistory);
      cy.intercept('/v0/profile/full_name', fullName);
    });
    it('the notifications does not show up - C13978', () => {
      // make sure that the Payment and Debt section is not shown
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
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
      }).as('features');
      mockLocalStorage();
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.intercept('/v0/profile/service_history', serviceHistory);
      cy.intercept('/v0/profile/full_name', fullName);
      cy.wait(['@features']);
    });
    it('and they have no notifications - C13979', () => {
      cy.intercept('/v0/onsite_notifications', notificationsSuccessEmpty()).as(
        'notifications',
      );
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they have a notification - C13025', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(),
      ).as('notifications');
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications').should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they have multiple notifications - C16720', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        multipleNotificationSuccess(),
      ).as('notifications');
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications').should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they have dismissed notifications - C16721', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessDismissed(),
      ).as('notifications');
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they have a notification error - C16722', () => {
      cy.intercept('/v0/onsite_notifications', notificationsError()).as(
        'notifications',
      );
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications-error').should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they dismiss a notification - C16723', () => {
      cy.intercept(
        'PATCH',
        `v0/onsite_notifications/e4213b12-eb44-4b2f-bac5-3384fbde0b7a`,
        {
          statusCode: 200,
          body: notificationSuccessDismissed(),
          delay: 100,
        },
      );
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(),
      ).as('notifications');
      cy.wait(['@notifications']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.get('va-alert')
        .shadow()
        .find('button.va-alert-close')
        .click();
      cy.findByTestId('dashboard-notifications').should('not.exist');
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
