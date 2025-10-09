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
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
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
      }).as('savePreference');

      // checkbox will start off unchecked because of the mocked
      // response from mockCommunicationPreferences

      // Prescription shipment and tracking updates
      cy.get('[data-testid="checkbox-group-item4"]')
        .find('va-checkbox')
        .as('prescriptionCheckbox');

      cy.get('@prescriptionCheckbox').should('exist');
      cy.get('@prescriptionCheckbox').should('not.be.checked');
      cy.get('@prescriptionCheckbox')
        .shadow()
        .find('input')
        .click({ force: true });
      cy.get('@prescriptionCheckbox').should('have.attr', 'checked', 'checked');

      // we should now see a saving indicator
      cy.get('[data-testid="loading-channel4-1"]')
        .as('savingButton')
        .should('exist');
      // after the POST call resolves:
      cy.wait('@savePreference');
      cy.get('@savingButton').should('not.exist');
      cy.get('[data-testid="success-channel4-1"]').should('exist');

      cy.get('@prescriptionCheckbox').should('have.attr', 'checked', 'checked');

      cy.injectAxeThenAxeCheck();
    });

    it('should allow opting out of getting notifications - C8545', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // Alias the PATCH request to wait for it
      cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
        statusCode: 200,
        body: mockPatchSuccess,
        delay: 200,
      }).as('savePreference');

      // checkbox will start off checked because of the
      // mocked response from mockCommunicationPreferences

      // Appointment Reminders
      cy.get('[data-testid="checkbox-group-item3"]')
        .find('va-checkbox')
        .as('appointmentCheckbox');

      cy.get('@appointmentCheckbox').should('exist');

      cy.get('@appointmentCheckbox')
        .shadow()
        .as('appointmentCheckboxShadow');

      cy.get('@appointmentCheckboxShadow')
        .find('input')
        .should('be.checked');

      cy.get('@appointmentCheckboxShadow')
        .find('input')
        .click({ force: true });

      // we should now see a saving indicator
      cy.get('[data-testid="loading-channel3-1"]')
        .as('savingButton')
        .should('exist');

      // Wait for the PATCH request to complete
      cy.wait('@savePreference');
      cy.get('@savingButton').should('not.exist');
      cy.get('[data-testid="success-channel3-1"]').should('exist');

      // checkbox should now be unchecked
      cy.get('@appointmentCheckboxShadow')
        .find('input')
        .should('not.be.checked');

      cy.injectAxeThenAxeCheck();
    });
  });
  it('should allow opting out of getting notifications - C8545', () => {
    cy.login(mockPatient);
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

    // Alias the PATCH request to wait for it
    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      statusCode: 200,
      body: mockPatchSuccess,
      delay: 200,
    }).as('savePreference');

    // checkbox will start off checked because of the
    // mocked response from mockCommunicationPreferences
    cy.get('[data-testid="checkbox-group-item3"]')
      .find('va-checkbox')
      .as('appointmentCheckbox');

    cy.get('@appointmentCheckbox').should('exist');

    cy.get('@appointmentCheckbox')
      .shadow()
      .as('appointmentCheckboxShadow');

    cy.get('@appointmentCheckboxShadow')
      .find('input')
      .should('be.checked');

    cy.get('@appointmentCheckboxShadow')
      .find('input')
      .click({ force: true });

    // we should now see a saving indicator
    cy.get('[data-testid="loading-channel3-1"]')
      .as('savingButton')
      .should('exist');

    // Wait for the PATCH request to complete
    cy.wait('@savePreference');
    cy.get('@savingButton').should('not.exist');
    cy.get('[data-testid="success-channel3-1"]').should('exist');

    // checkbox should now be unchecked
    cy.get('@appointmentCheckboxShadow')
      .find('input')
      .should('not.be.checked');

    cy.injectAxeThenAxeCheck();
  });
});
