/**
 * [TestRail-integrated] Spec for Notification Prefs > Missing contact info
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2415
 * @testrailinfo runName NP-e2e-Missing-contact-info
 */

import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { makeMockUser } from '@@profile/tests/fixtures/users/user';

import { PROFILE_PATHS } from '@@profile/constants';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

registerCypressHelpers();

describe('Notification Settings', () => {
  let getCommPrefsStub;
  beforeEach(() => {
    getCommPrefsStub = cy.stub();
    mockNotificationSettingsAPIs();
    cy.intercept('/v0/profile/communication_preferences', req => {
      getCommPrefsStub();
      req.reply({
        statusCode: 200,
        body: mockCommunicationPreferences,
      });
    });
  });

  context(
    'when both mobile phone and email are enabled communication channels',
    () => {
      context('when user is missing mobile phone', () => {
        it('should show available email notifications and show expandable alert for mobile notifications - C9503', () => {
          cy.intercept(
            'GET',
            '/v0/feature_toggles*',
            generateFeatureToggles({
              profileShowEmailNotificationSettings: true,
              profileShowMhvNotificationSettings: true,
              profileShowPaymentsNotificationSetting: true,
            }),
          );
          const user = makeMockUser();
          user.data.attributes.vet360ContactInformation.mobilePhone = null;
          cy.login(user);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
          cy.findByRole('heading', {
            name: 'Notification settings',
            level: 1,
          }).should('exist');

          cy.loadingIndicatorWorks();

          cy.findByText('veteran@gmail.com').should('exist');

          cy.findAllByTestId('notification-group').should('exist');

          // email based notifications should be shown
          cy.findByText('RX refill shipment notification').should('exist');
          cy.findByText('VA Appointment reminders').should('exist');
          cy.findByText('Secure messaging alert').should('exist');
          cy.findByText('Medical images and reports available').should('exist');

          cy.get('va-alert-expandable').click();

          // should find alert with details on what notifications are missing due to missing mobile phone
          cy.get('va-alert-expandable').within(() => {
            cy.findByRole('link', {
              name: 'Add your mobile number to your profile',
            }).should('exist');
            cy.findByText('Appointment reminders').should('exist');
            cy.findByText('Prescription shipment and tracking updates').should(
              'exist',
            );
            cy.findByText('Appeal status updates').should('exist');
            cy.findByText(
              'Disability and pension deposit notifications',
            ).should('exist');
          });

          cy.injectAxeThenAxeCheck();
        });
      });
      context('when user is missing email address', () => {
        it('should show available mobile text notifications and show expandable alert for email notifications - C9504', () => {
          cy.intercept(
            'GET',
            '/v0/feature_toggles*',
            generateFeatureToggles({
              profileShowEmailNotificationSettings: true,
              profileShowMhvNotificationSettings: true,
              profileShowPaymentsNotificationSetting: true,
            }),
          );
          const user = makeMockUser();
          user.data.attributes.vet360ContactInformation.email = null;
          cy.login(user);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
          cy.findByRole('heading', {
            name: 'Notification settings',
            level: 1,
          }).should('exist');

          cy.loadingIndicatorWorks();

          cy.findByTestId('mobile-phone-number-on-file')
            .shadow()
            .findByText('503-555-1234')
            .should('exist');

          cy.findAllByTestId('notification-group').should('exist');

          // text based notifications should be shown
          cy.findByText('Appointment reminders').should('exist');
          cy.findByText('Prescription shipment and tracking updates').should(
            'exist',
          );
          cy.findByText(`Board of Veterans' Appeals hearing reminder`).should(
            'exist',
          );
          cy.findByText('Appeal status updates').should('exist');
          cy.findByText('Disability and pension deposit notifications').should(
            'exist',
          );

          cy.get('va-alert-expandable').click();

          // should find alert with details on what notifications are missing due to missing mobile phone
          cy.get('va-alert-expandable').within(() => {
            cy.findByRole('link', {
              name: 'Add your email address to your profile',
            }).should('exist');
            cy.findByText('RX refill shipment notification').should('exist');
            cy.findByText('VA Appointment reminders').should('exist');
            cy.findByText('Secure messaging alert').should('exist');
            cy.findByText('Medical images and reports available').should(
              'exist',
            );
            cy.findByText('Biweekly MHV newsletter').should('exist');
          });

          cy.injectAxeThenAxeCheck();
        });
      });
      context(
        'when user is missing both email address and mobile phone',
        () => {
          it('should show the correct message, not attempt to fetch notification prefs, and hide all notification groups - C9505', () => {
            cy.intercept(
              'GET',
              '/v0/feature_toggles*',
              generateFeatureToggles({
                profileShowEmailNotificationSettings: true,
                profileShowMhvNotificationSettings: true,
              }),
            );
            const user = makeMockUser();
            user.data.attributes.vet360ContactInformation.email = null;
            user.data.attributes.vet360ContactInformation.mobilePhone = null;
            cy.login(user);
            cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
            cy.findByRole('heading', {
              name: 'Notification settings',
              level: 1,
            }).should('exist');

            // there should be no loading indicator
            cy.get('va-loading-indicator').should('not.exist');
            cy.injectAxeThenAxeCheck();

            // and then the loading indicator should be removed
            cy.get('va-loading-indicator').should('not.exist');
            cy.injectAxeThenAxeCheck();

            cy.findByText('We don’t have your contact information').should(
              'exist',
            );

            cy.findByTestId('missing-contact-info-alert')
              .should('exist')
              .and('contain.text', 'phone number')
              .and('contain.text', 'email address');

            cy.should(() => {
              expect(getCommPrefsStub).not.to.be.called;
            });

            cy.findByTestId('add-mobile-phone-link')
              .shadow()
              .within(() => {
                cy.findByRole('link', {
                  name: 'Add a phone number to your profile',
                }).should('exist');
              });

            cy.findByTestId('add-email-address-link')
              .shadow()
              .within(() => {
                cy.findByRole('link', {
                  name: 'Add an email address to your profile',
                }).should('exist');
              });

            cy.findAllByTestId('notification-group').should('not.exist');
          });
        },
      );
    },
  );
  // TODO: Disable/delete these tests when the COVID-19 alerts are a supported
  // notification item. Or whenever a notification item supports email as a
  // notification channel
  context(
    'when only mobile phone is the only supported communication channel',
    () => {
      context('when user is missing mobile phone', () => {
        it('should show the correct message, not attempt to fetch notification prefs, and hide all notification groups - C9506', () => {
          const user = makeMockUser();
          user.data.attributes.vet360ContactInformation.mobilePhone = null;
          cy.login(user);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
          cy.findByRole('heading', {
            name: 'Notification settings',
            level: 1,
          }).should('exist');

          // there should be no loading indicator
          cy.get('va-loading-indicator').should('not.exist');
          cy.injectAxeThenAxeCheck();

          cy.findAllByTestId('add-mobile-phone-link')
            .shadow()
            .within(() => {
              cy.findByRole('link', {
                name: 'Add a phone number to your profile',
              }).should('exist');
            });

          cy.findAllByTestId('notification-group').should('not.exist');
          cy.should(() => {
            expect(getCommPrefsStub).not.to.be.called;
          });
        });
      });
      context('when user is missing email address', () => {
        it('when profileShowEmailNotificationSettings is false, should not show missing contact info alert  - C9507', () => {
          cy.intercept(
            'GET',
            '/v0/feature_toggles*',
            generateFeatureToggles({
              profileShowEmailNotificationSettings: false,
            }),
          );
          const user = makeMockUser();
          user.data.attributes.vet360ContactInformation.email = null;
          cy.login(user);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
          cy.findByRole('heading', {
            name: 'Notification settings',
            level: 1,
          }).should('exist');

          cy.loadingIndicatorWorks();

          cy.findByTestId('mobile-phone-number-on-file')
            .shadow()
            .findByText(/503-555-1234/i)
            .should('exist');
          cy.findByTestId('missing-contact-info-alert').should('not.exist');
          cy.findAllByTestId('notification-group').should('exist');

          cy.findAllByTestId('add-mobile-phone-link').should('not.exist');
          cy.injectAxeThenAxeCheck();
        });
      });
    },
  );
});
