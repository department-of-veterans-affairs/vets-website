import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';
import { PROFILE_PATHS } from '@@profile/constants';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

registerCypressHelpers();

describe('Notification Settings For Mobile Phone', () => {
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
    cy.injectAxe();
  });

  context('mobile phone link correct', () => {
    context('when user is missing mobile phone', () => {
      it('should show the correct mobile phone link', () => {
        cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);
        const user = makeMockUser();
        user.data.attributes.vet360ContactInformation.mobilePhone = null;
        cy.login(user);
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.get('va-loading-indicator')
          .should('exist')
          .then($container => {
            cy.wrap($container)
              .shadow()
              .findByRole('progressbar', { name: /loading/i })
              .should('exist');
          });

        cy.injectAxeThenAxeCheck();

        // and then the loading indicator should be removed
        cy.get('va-loading-indicator').should('not.exist');
        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.findByTestId('missing-contact-info-alert')
          .should('exist')
          .and('contain.text', 'mobile phone');

        cy.findAllByTestId('add-mobile-phone-link')
          .shadow()
          .within(() => {
            cy.findByRole('link', {
              name: 'Add a phone number to your profile',
            }).should('exist');
          });

        cy.findByTestId('add-email-address-link').should('not.exist');
        cy.axeCheck();
      });
    });
  });

  context(
    'when user is missing mobile phone, email and the profileShowEmailNotificationSettings toggle is true',
    () => {
      it('should show the correct mobile phone and email link in alert', () => {
        cy.intercept(
          'v0/feature_toggles*',
          generateFeatureToggles({
            profileShowMhvNotificationSettingsEmailAppointmentReminders: true,
          }),
        );
        const user = makeMockUser();
        user.data.attributes.vet360ContactInformation.mobilePhone = null;
        user.data.attributes.vet360ContactInformation.email = null;
        cy.login(user);
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.injectAxeThenAxeCheck();

        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.findByTestId('missing-contact-info-alert').should('exist');

        cy.findByText(`We don’t have your contact information`).should('exist');

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

        cy.axeCheck();
      });
    },
  );
});
