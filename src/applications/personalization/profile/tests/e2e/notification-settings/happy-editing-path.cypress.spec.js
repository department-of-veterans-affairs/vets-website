import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import mockPostSuccess from '@@profile/tests/fixtures/communication-preferences/post-200-success.json';
import mockPatchSuccess from '@@profile/tests/fixtures/communication-preferences/patch-200-success.json';

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
      statusCode: 200,
      body: mockPostSuccess,
      delay: 100,
    });
    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      statusCode: 200,
      body: mockPatchSuccess,
      delay: 100,
    });
  });
  context('when the API behaves', () => {
    it('should allow opting into getting notifications for the first time', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      cy.findByTestId('select-options-alert').should('exist');

      // both radio buttons will start off unchecked because of the mocked
      // response from mockCommunicationPreferences
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by email/i,
      }).should('not.be.checked');

      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by email/i,
      })
        .should('not.be.checked')
        .click()
        .should('be.checked')
        .should('be.disabled');

      // we should now see a saving indicator
      cy.findByText(/^Saving.../).should('exist');
      // after the POST call resolves:
      cy.findByText(/^Saving.../).should('not.exist');
      cy.findByText(/update saved/i).should('exist');
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by email/i,
      }).should('not.be.checked');
      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by email/i,
      })
        .should('be.checked')
        .should('not.be.disabled');

      cy.findByTestId('select-options-alert').should('not.exist');
    });

    it('should allow opting out of getting notifications', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // the "do not notify" radio button will start off checked because of the
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
      cy.findByText(/^Saving/).should('exist');
      // after the PATCH call resolves:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/update saved/i).should('exist');
      cy.findByRole('radio', {
        name: /^notify me of.*hearing reminder.*by text/i,
      }).should('not.be.checked');
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by text/i,
      })
        .should('be.checked')
        .should('not.be.disabled');
    });
  });
});
