import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { generateFeatureToggles } from '@@profile/mocks/feature-toggles';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

import NotificationSettingsFeature from './NotificationSettingsFeature';

// tests anything that relies on feature toggles within the notifications settings page

registerCypressHelpers();

describe('Notification Settings Feature Toggles', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
  });

  describe('Shows/Hides payment notification settings via feature toggles', () => {
    it('should SHOW the payment notification when toggle profileShowPaymentsNotificationSetting is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowPaymentsNotificationSetting: true,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      // sanity check
      // check that hearing notification is rendering first
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by email/i,
      }).should('exist');

      // check that payment options display
      NotificationSettingsFeature.confirmPaymentNotificationSetting({
        exists: true,
      });

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

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      NotificationSettingsFeature.confirmPaymentNotificationSetting({
        exists: false,
      });

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Shows/Hides appeals status notification settings via feature toggles', () => {
    it('should SHOW appeal status notification setting when toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowAppealStatusNotificationSetting: true,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      // check that hearing notification is rendering first
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by email/i,
      }).should('exist');

      // check that appeal status setting displays
      NotificationSettingsFeature.confirmAppealsStatusSetting({ exists: true });

      cy.injectAxeThenAxeCheck();
    });

    it('should NOT show appeal status notification setting when toggle is FALSE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowAppealStatusNotificationSetting: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      // check that hearing notification is rendering first
      cy.findByRole('radio', {
        name: /^do not notify me of.*hearing reminder.*by email/i,
      }).should('exist');

      // check that appeal status setting does not display
      NotificationSettingsFeature.confirmAppealsStatusSetting({
        exists: false,
      });

      cy.injectAxeThenAxeCheck();
    });
  });
});
