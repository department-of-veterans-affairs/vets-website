/**
 * [TestRail-integrated] Spec for My VA - On-Site-Notification
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3376
 * @testrailinfo runName MyVA On-site Notification - Debt
 */
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  debtsSuccess,
  debtsSuccessEmpty,
} from '../fixtures/test-debts-response';
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
    it('and they have no debt - C13979', () => {
      cy.intercept('/v0/debts', debtsSuccessEmpty());
      cy.findByTestId('dashboard-notifications').should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('and they have a debt - C13025', () => {
      cy.intercept('/v0/debts', debtsSuccess()).as('debts');
      cy.wait(['@debts']);
      cy.findByTestId('dashboard-notifications').should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
