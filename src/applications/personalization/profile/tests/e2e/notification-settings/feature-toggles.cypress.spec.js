import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';

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
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
  });

  describe('Shows/Hides QuickSubmit settings via feature toggle', () => {
    it('should NOT SHOW the QuickSubmit if setting EVEN when toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowQuickSubmitNotificationSetting: true,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      NotificationSettingsFeature.confirmQuickSubmitNotificationSetting({
        exists: false,
      });

      cy.injectAxeThenAxeCheck();
    });

    it('should NOT SHOW the QuickSubmit if setting when toggle is FALSE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowQuickSubmitNotificationSetting: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      NotificationSettingsFeature.confirmQuickSubmitNotificationSetting({
        exists: false,
      });

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Shows/Hides MHV settings via feature toggle', () => {
    it('should SHOW the MHV settings when all the notification settings toggles are TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: true,
          profileShowMhvNotificationSettingsNewSecureMessaging: true,
          profileShowMhvNotificationSettingsEmailRxShipment: true,
          profileShowMhvNotificationSettingsMedicalImages: true,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');
      cy.get('[data-testid="checkbox-group-item4"]')
        .shadow()
        .findByText('Prescription shipment and tracking updates')
        .should('exist');

      cy.get('[data-testid="checkbox-group-item9"]')
        .shadow()
        .findByText('Secure messaging alert')
        .should('exist');
      cy.get('[data-testid="checkbox-group-item10"]')
        .shadow()
        .findByText('Medical images and reports available')
        .should('exist');
      cy.get('[data-testid="checkbox-group-item5"]')
        .shadow()
        .findByText('Disability and pension deposit notifications')
        .should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should NOT SHOW any MHV settings beside Appointment reminder for text when all the toggles are FALSE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: false,
          profileShowMhvNotificationSettingsNewSecureMessaging: false,
          profileShowMhvNotificationSettingsEmailRxShipment: false,
          profileShowMhvNotificationSettingsMedicalImages: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');

      // Secure messaging alert
      cy.get('[data-testid="checkbox-group-item9"]').should('not.exist');
      // Medical images and reports available
      cy.get('[data-testid="checkbox-group-item10"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should show Appointment reminder settings for text when all the profileShowMhvNotificationSettingsEmailAppointmentReminders toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: true,
          profileShowMhvNotificationSettingsNewSecureMessaging: false,
          profileShowMhvNotificationSettingsEmailRxShipment: false,
          profileShowMhvNotificationSettingsMedicalImages: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');

      // Secure messaging alert
      cy.get('[data-testid="checkbox-group-item9"]').should('not.exist');
      // Medical images and reports available
      cy.get('[data-testid="checkbox-group-item10"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should show Secure messaging alert settings for text when all the profileShowMhvNotificationSettingsNewSecureMessaging toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: false,
          profileShowMhvNotificationSettingsNewSecureMessaging: true,
          profileShowMhvNotificationSettingsEmailRxShipment: false,
          profileShowMhvNotificationSettingsMedicalImages: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');

      cy.get('[data-testid="checkbox-group-item9"]')
        .shadow()
        .findByText('Secure messaging alert')
        .should('exist');

      // Medical images and reports available
      cy.get('[data-testid="checkbox-group-item10"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should show Prescription shipment and tracking updates settings for text when all the profileShowMhvNotificationSettingsEmailRxShipment toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: false,
          profileShowMhvNotificationSettingsNewSecureMessaging: false,
          profileShowMhvNotificationSettingsEmailRxShipment: true,
          profileShowMhvNotificationSettingsMedicalImages: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');

      cy.get('[data-testid="checkbox-group-item4"]')
        .shadow()
        .findByText('Prescription shipment and tracking updates')
        .should('exist');

      // Secure messaging alert
      cy.get('[data-testid="checkbox-group-item9"]').should('not.exist');
      // Medical images and reports available
      cy.get('[data-testid="checkbox-group-item10"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should show Medical images and reports available settings for text when all the profileShowMhvNotificationSettingsMedicalImages toggle is TRUE', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileShowMhvNotificationSettingsEmailAppointmentReminders: false,
          profileShowMhvNotificationSettingsNewSecureMessaging: false,
          profileShowMhvNotificationSettingsEmailRxShipment: true,
          profileShowMhvNotificationSettingsMedicalImages: false,
        }),
      );

      NotificationSettingsFeature.loginAsUser36AndVisitNotficationSettingsPage();

      NotificationSettingsFeature.confirmHearingReminderNotificationSanityCheck();

      cy.get('[data-testid="checkbox-group-item3"]')
        .shadow()
        .findByText('Appointment reminders')
        .should('exist');

      cy.get('[data-testid="checkbox-group-item4"]')
        .shadow()
        .findByText('Prescription shipment and tracking updates')
        .should('exist');

      // Secure messaging alert
      cy.get('[data-testid="checkbox-group-item9"]').should('not.exist');
      // Medical images and reports available
      cy.get('[data-testid="checkbox-group-item10"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
