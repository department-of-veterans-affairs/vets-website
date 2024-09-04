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

const PRESCRIPTION_NOTIFICATION_TEXT =
  'Prescription shipment and tracking updates';

const APPOINTMENT_NOTIFICATION_TEXT = 'Appointment reminders';

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

      // checkbox will start off unchecked because of the mocked
      // response from mockCommunicationPreferences

      cy.findByText(PRESCRIPTION_NOTIFICATION_TEXT)
        .closest('fieldset')
        .find('va-checkbox')
        .as('prescriptionCheckbox');

      cy.get('@prescriptionCheckbox').should('exist');
      cy.get('@prescriptionCheckbox').should('not.be.checked');
      cy.get('@prescriptionCheckbox').click();
      cy.get('@prescriptionCheckbox').should('have.attr', 'checked', 'checked');

      // we should now see a saving indicator
      cy.findByText(/^Saving.../).should('exist');
      // after the POST call resolves:
      cy.findByText(/^Saving.../).should('not.exist');
      cy.findByText(/update saved/i).should('exist');

      cy.get('@prescriptionCheckbox').should('have.attr', 'checked', 'checked');

      cy.injectAxeThenAxeCheck();
    });

    it('should allow opting out of getting notifications - C8545', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // checkbox will start off checked because of the
      // mocked response from mockCommunicationPreferences
      cy.findByText(APPOINTMENT_NOTIFICATION_TEXT)
        .closest('fieldset')
        .find('va-checkbox')
        .as('appointmentCheckbox');

      cy.get('@appointmentCheckbox').should('exist');

      cy.get('@appointmentCheckbox')
        .shadow()
        .as('appointmentCheckboxShadow');

      cy.get('@appointmentCheckboxShadow')
        .find('input')
        .should('be.checked');

      cy.get('@appointmentCheckbox').click();

      // we should now see a saving indicator
      cy.findByText(/^Saving/).should('exist');
      // after the PATCH call resolves:
      cy.findByText(/^Saving/).should('not.exist');
      cy.findByText(/update saved/i).should('exist');

      // checkbox should now be unchecked
      cy.get('@appointmentCheckboxShadow')
        .find('input')
        .should('not.be.checked');

      cy.injectAxeThenAxeCheck();
    });
  });
});
