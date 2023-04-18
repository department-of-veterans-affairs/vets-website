/**
 * [TestRail-integrated] Spec for Notification Prefs > Sad editing path
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2425
 * @testrailinfo runName NP-e2e-Sad-editing-path
 */

import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import error401 from '@@profile/tests/fixtures/401.json';
import error500 from '@@profile/tests/fixtures/500.json';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

registerCypressHelpers();

describe('Updating Notification Settings', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
    cy.intercept('POST', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: error401,
      delay: 100,
    });
    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      statusCode: 500,
      body: error500,
      delay: 100,
    });
  });
  context('when there is an API error', () => {
    it('should handle 401 errors when opting into getting notifications for the first time - C9518', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      //
      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by text/i,
      }).should('be.checked');

      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by text/i,
      })
        .should('not.be.checked')
        .click()
        .should('be.checked')
        .should('be.disabled');

      // we should now see a saving indicator
      cy.findByText(/^Saving/).should('exist');
      // after the POST call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by text/i,
      })
        .should('not.be.checked')
        .should('not.be.disabled');
      cy.injectAxeThenAxeCheck();
    });

    it('should handle 500 error when opting out of getting notifications - C9519', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // the "notify me" radio button will start off checked because of the
      // mocked response from mockCommunicationPreferences
      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by text/i,
      }).should('be.checked');
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by text/i,
      })
        .should('not.be.checked')
        .click()
        .should('be.checked')
        .should('be.disabled');

      // we should now see a saving indicator
      cy.findByText(/^Saving.../).should('exist');
      // after the PATCH call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/update saved/i).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');
      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by text/i,
      })
        .should('be.checked')
        .should('not.be.disabled');
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by text/i,
      })
        .should('not.be.checked')
        .should('not.be.disabled');
      cy.injectAxeThenAxeCheck();
    });
  });
});
