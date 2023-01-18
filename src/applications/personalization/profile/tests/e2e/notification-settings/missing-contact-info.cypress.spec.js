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
  // TODO: Re-enable these tests when the COVID-19 alerts are a supported
  // notification item. Or whenever a notification item supports email as a
  // notification channel
  context.skip(
    'when both mobile phone and email are supported communication channels',
    () => {
      context('when user is missing mobile phone', () => {
        it('should show the correct messages - C9503', () => {
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
          cy.findByText('Appointment reminders').should('exist');
          cy.findByText('Prescription shipment and tracking updates').should(
            'exist',
          );
          cy.findByTestId('missing-contact-info-alert')
            .should('exist')
            .and('contain.text', 'mobile phone')
            .within(() => {
              cy.findByRole('link', { name: /add.*mobile.*profile/i }).should(
                'exist',
              );
            });
          cy.findAllByRole('link', { name: /add your mobile/i }).should(
            'have.length.above',
            2,
          );
          cy.findAllByTestId('notification-group').should('exist');
          cy.findByRole('link', { name: /add your email/i }).should(
            'not.exist',
          );
        });
      });
      context('when user is missing email address', () => {
        it('should show the correct messages - C9504', () => {
          const user = makeMockUser();
          user.data.attributes.vet360ContactInformation.email = null;
          cy.login(user);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
          cy.findByRole('heading', {
            name: 'Notification settings',
            level: 1,
          }).should('exist');

          cy.loadingIndicatorWorks();

          cy.findByText('503-555-1234').should('exist');
          cy.findByTestId('missing-contact-info-alert')
            .should('exist')
            .and('contain.text', 'email address')
            .within(() => {
              cy.findByRole('link', { name: /add.*email.*profile/i }).should(
                'exist',
              );
            });
          cy.findAllByRole('link', { name: /add your email/i }).should(
            'have.lengthOf',
            2,
          );
          cy.findAllByTestId('notification-group').should('exist');
          cy.findByRole('link', { name: /add your mobile/i }).should(
            'not.exist',
          );
        });
      });
      context(
        'when user is missing both email address and mobile phone',
        () => {
          it('should show the correct message, not attempt to fetch notification prefs, and hide all notification groups - C9505', () => {
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
            cy.findByRole('progressbar', { name: /loading/i }).should(
              'not.exist',
            );
            cy.injectAxeThenAxeCheck();

            cy.findByTestId('missing-contact-info-alert')
              .should('exist')
              .and('contain.text', 'mobile phone')
              .and('contain.text', 'email address')
              .invoke('text')
              .should('match', /we don’t have your contact info/i)
              .and('match', /update.*contact info/i);
            cy.should(() => {
              expect(getCommPrefsStub).not.to.be.called;
            });
            cy.findByRole('link', { name: /update your contact info/i }).should(
              'exist',
            );
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
          cy.findByRole('progressbar', { name: /loading/i }).should(
            'not.exist',
          );
          cy.injectAxeThenAxeCheck();

          cy.findByTestId('missing-contact-info-alert')
            .should('exist')
            .and('contain.text', 'mobile phone')
            .within(() => {
              cy.findByRole('link', { name: /add.*mobile.*profile/i }).should(
                'exist',
              );
            });
          cy.findAllByTestId('notification-group').should('not.exist');
          cy.should(() => {
            expect(getCommPrefsStub).not.to.be.called;
          });
        });
      });
      context('when user is missing email address', () => {
        it('should not show an alert - C9507', () => {
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
          cy.findByRole('link', { name: /add your mobile/i }).should(
            'not.exist',
          );
        });
      });
    },
  );
});
