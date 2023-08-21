/**
 * [TestRail-integrated] Spec for Notification Prefs > Happy editing path
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2168
 * @testrailinfo runName NP-e2e-Happy-editing-path
 */

import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import mockPostSuccessShippingUpdates from '@@profile/tests/fixtures/communication-preferences/post-200-success-shipping-updates.json';
import mockPatchSuccess from '@@profile/tests/fixtures/communication-preferences/patch-200-success.json';

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

    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      statusCode: 200,
      body: mockPatchSuccess,
      delay: 100,
    });
  });
  context('when the API behaves', () => {
    it('should allow opting into getting notifications for the first time - C8544', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      cy.intercept('POST', '/v0/profile/communication_preferences', {
        statusCode: 200,
        body: mockPostSuccessShippingUpdates,
        delay: 100,
      });

      const doNotifyRadioName =
        'Notify me of Prescription shipment and tracking updates by text';

      const dontNotifyRadioName =
        'Do not notify me of Prescription shipment and tracking updates by text';

      // radio button will start off unchecked because of the mocked
      // response from mockCommunicationPreferences

      cy.findByRole('radio', {
        name: doNotifyRadioName,
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
        name: dontNotifyRadioName,
      }).should('not.be.checked');
      cy.findByRole('radio', {
        name: doNotifyRadioName,
      })
        .should('be.checked')
        .should('not.be.disabled');

      cy.findByTestId('select-options-alert').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });

    it('should allow opting out of getting notifications - C8545', () => {
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
      cy.injectAxeThenAxeCheck();
    });
  });
});
