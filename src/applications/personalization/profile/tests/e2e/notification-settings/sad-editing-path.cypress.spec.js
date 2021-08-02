import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import error401 from '@@profile/tests/fixtures/401.json';
import error500 from '@@profile/tests/fixtures/500.json';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe('Updating Notification Settings', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
    cy.intercept('POST', '/v0/profile/communication_preferences', {
      statusCode: 401,
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
    it('should handle 401 errors when opting into getting notifications for the first time', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // the checkbox will start off unchecked because of the mocked response
      // from mockCommunicationPreferences
      cy.findByRole('checkbox', {
        name: /notify me of.*hearing reminder.*by email/i,
      })
        .should('not.be.checked')
        .click()
        .should('be.checked')
        .should('be.disabled');

      // we should now see a saving indicator
      cy.findByText(/^Saving/).should('exist');
      // after the POST call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/you’ve updated your.*notifications/i).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');
      cy.findByRole('checkbox', {
        name: /notify me of.*hearing reminder.*by email/i,
      })
        .should('not.be.checked')
        .should('not.be.disabled');
    });

    it('should handle 500 error when opting out of getting notifications', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // the checkbox will start off checked because of the mocked response
      // from mockCommunicationPreferences
      cy.findByRole('checkbox', {
        name: /notify me of.*hearing reminder.*by text/i,
      })
        .should('be.checked')
        .click()
        .should('not.be.checked')
        .should('be.disabled');

      // we should now see a saving indicator
      cy.findByText(/^Saving/).should('exist');
      // after the PATCH call fails:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/you’ve updated your.*notifications/i).should('not.exist');
      cy.findByText(/we’re sorry.*try again/i).should('exist');
      cy.findByRole('checkbox', {
        name: /notify me of.*hearing reminder.*by text/i,
      })
        .should('be.checked')
        .should('not.be.disabled');
    });
  });
});
