/**
 * [TestRail-integrated] Spec for Notification Prefs > Loading errors
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2411
 * @testrailinfo runName NP-e2e-Loading-errors
 */

import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import { mockUser as mockUserVAPError } from '@@profile/tests/fixtures/users/user-vap-error';
import error500 from '@@profile/tests/fixtures/500.json';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

registerCypressHelpers();

describe('Notification Settings - Load Errors', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
  });
  context('when VA Profile contact info is not available', () => {
    it('should show an error message and not even try to fetch current notification preferences - C9491', () => {
      const getCommPrefsStub = cy.stub();
      cy.intercept('GET', 'v0/profile/communication_preferences', () => {
        getCommPrefsStub();
      });

      cy.login(mockUserVAPError);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');
      cy.findByTestId('service-is-down-banner').should('exist');
      cy.should(() => {
        expect(getCommPrefsStub).not.to.be.called;
      });
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when we cannot fetch current notification preferences', () => {
    it('should show an error message - C9492', () => {
      cy.intercept('GET', 'v0/profile/communication_preferences', {
        statusCode: 500,
        data: error500,
      });
      cy.login(mockUser);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();
      // and an error message appears
      cy.findByTestId('service-is-down-banner').should('exist');
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
