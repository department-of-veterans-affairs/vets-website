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
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import {
  notificationsError,
  notificationSuccessDismissed,
  notificationsSuccessEmpty,
  notificationSuccessNotDismissed,
  multipleNotificationSuccess,
} from '../fixtures/test-notifications-response';

describe('The My VA Dashboard - Notifications', () => {
  // TODO: Fix for CI (try local headless)
  Cypress.config({ defaultCommandTimeout: 12000 });
  beforeEach(() => {
    cy.intercept('/v0/profile/service_history', serviceHistory).as('serviceB');
    cy.intercept('/v0/profile/full_name', fullName).as('nameB');
    mockLocalStorage();
  });
  context('when user has no notifications - C13979', () => {
    it('should show no notifications', () => {
      cy.intercept('/v0/onsite_notifications', notificationsSuccessEmpty()).as(
        'notifications1',
      );
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications1']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when old Notification component is showing (va-alert)', () => {
    it('and they have a notification - C13025', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(Cypress.env('CI')),
      ).as('notifications2');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications2']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('dashboard-notification-alert').should('exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they have multiple notifications - C16720', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        multipleNotificationSuccess(Cypress.env('CI')),
      ).as('notifications3');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications3']);
      cy.findByTestId('dashboard-notifications').should('exist');
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
        notificationSuccessDismissed(Cypress.env('CI')),
      ).as('notifications4');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications4']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they dismiss a notification - C16723', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(Cypress.env('CI')),
      ).as('notifications6');
      cy.intercept(
        'PATCH',
        `v0/onsite_notifications/e4213b12-eb44-4b2f-bac5-3384fbde0b7a`,
        {
          statusCode: 200,
          body: notificationSuccessDismissed(),
          delay: 100,
        },
      ).as('patch');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications6']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('dashboard-notification-alert').should(
        'have.length',
        1,
      );
      cy.get('va-alert')
        .shadow()
        .find('button.va-alert-close')
        .click({ waitForAnimations: true, force: true });
      cy.wait('@patch');
      cy.findAllByTestId('dashboard-notification-alert').should('not.exist');
      cy.findByTestId('dashboard-notifications').should('not.exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
  });

  context('when new Notification component is showing', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.myVaEnableNotificationComponent,
              value: true,
            },
          ],
        },
      }).as('notificationFeature');
    });
    it('and they have a notification - C13025', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(Cypress.env('CI')),
      ).as('notifications2');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications2']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.findByTestId('onsite-notification-card').should('exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they have multiple notifications - C16720', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        multipleNotificationSuccess(Cypress.env('CI')),
      ).as('notifications3');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications3']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('onsite-notification-card').should('have.length', 2);
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root'); // First AXE-check already checked the whole
    });
    it('and they have dismissed notifications - C16721', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessDismissed(Cypress.env('CI')),
      ).as('notifications4');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications4']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
    it('and they dismiss a notification - C16723', () => {
      cy.intercept(
        '/v0/onsite_notifications',
        notificationSuccessNotDismissed(Cypress.env('CI')),
      ).as('notifications6');
      cy.intercept(
        'PATCH',
        `v0/onsite_notifications/e4213b12-eb44-4b2f-bac5-3384fbde0b7a`,
        {
          statusCode: 200,
          body: notificationSuccessDismissed(),
          delay: 100,
        },
      ).as('patch');
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications6']);
      cy.findByTestId('dashboard-notifications').should('exist');
      cy.findAllByTestId('onsite-notification-card').should('have.length', 1);
      cy.get('button.va-notification-close').click({ force: true });
      cy.wait('@patch');
      cy.findByTestId('onsite-notification-card').should('not.exist');
      cy.findByTestId('dashboard-notifications').should('not.exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
  });

  context('when user has a notification error - C16722,', () => {
    it('should show no notifications', () => {
      cy.intercept('/v0/onsite_notifications', notificationsError()).as(
        'notifications5',
      );
      cy.login(mockUser);
      cy.visit('my-va/');
      cy.wait(['@nameB', '@serviceB', '@notifications5']);
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('#react-root');
    });
  });
});
