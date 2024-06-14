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

const HEARING_REMINDER_NOTIFICATION_TEXT = `Board of Veterans' Appeals hearing reminder`;

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

      cy.findByText(HEARING_REMINDER_NOTIFICATION_TEXT)
        .closest('fieldset')
        .find('va-checkbox')
        .as('hearingCheckbox');

      cy.get('@hearingCheckbox')
        .shadow()
        .find('input')
        .as('hearingCheckboxInput');

      cy.get('@hearingCheckbox').should('exist');
      cy.get('@hearingCheckboxInput').should('be.checked');
      cy.get('@hearingCheckbox').click();

      // we should now see a saving indicator
      cy.findByText(/^Saving/).should('exist');
      // after the POST call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');

      // the checkbox should still be checked after failure
      cy.get('@hearingCheckboxInput').should('be.checked');

      cy.injectAxeThenAxeCheck();
    });

    it('should handle 500 error when opting out of getting notifications - C9519', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // the "notify me" radio button will start off checked because of the
      // mocked response from mockCommunicationPreferences
      cy.findByText(HEARING_REMINDER_NOTIFICATION_TEXT)
        .closest('fieldset')
        .find('va-checkbox')
        .as('hearingCheckbox');

      cy.get('@hearingCheckbox')
        .shadow()
        .find('input')
        .as('hearingCheckboxInput');

      cy.get('@hearingCheckbox').should('exist');
      cy.get('@hearingCheckboxInput').should('be.checked');
      cy.get('@hearingCheckbox').click();

      // we should now see a saving indicator
      cy.findByText(/^Saving.../).should('exist');
      // after the PATCH call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/update saved/i).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');

      // the checkbox should still be checked after failure
      cy.get('@hearingCheckboxInput').should('be.checked');

      cy.injectAxeThenAxeCheck();
    });
  });
});
