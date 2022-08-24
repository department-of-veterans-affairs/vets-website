import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { generateFeatureToggles } from '@@profile/mocks/feature-toggles';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

registerCypressHelpers();

describe('Shows/Hides payment notification setting via feature toggle', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
  });

  it('should SHOW the payment notification setting when toggle is TRUE', () => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowPaymentsNotificationSetting: true,
      }),
    );

    cy.login(mockPatient);
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

    // check that hearing notification is rendering first
    cy.findByRole('radio', {
      name: /^do not notify me of.*hearing reminder.*by email/i,
    }).should('exist');

    // check that payment options display
    cy.findByRole('radio', {
      name: /^Notify me of Disability and pension deposit notifications by text/i,
    }).should('exist');

    cy.findByRole('radio', {
      name: /^Do not notify me of Disability and pension deposit notifications by text/i,
    }).should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should NOT SHOW the payment notification setting when toggle is FALSE', () => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowPaymentsNotificationSetting: false,
      }),
    );

    cy.login(mockPatient);
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

    // check that hearing notification is rendering first
    cy.findByRole('radio', {
      name: /^do not notify me of.*hearing reminder.*by email/i,
    }).should('exist');

    // check that payment options display
    cy.findByRole('radio', {
      name: /^Notify me of Disability and pension deposit notifications by text/i,
    }).should('not.exist');

    cy.findByRole('radio', {
      name: /^Do not notify me of Disability and pension deposit notifications by text/i,
    }).should('not.exist');

    cy.injectAxeThenAxeCheck();
  });
});
