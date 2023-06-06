import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';

import { PROFILE_PATHS } from '@@profile/constants';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

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
  // TODO: Re-enable these tests when the COVID-19 alerts are a supported
  // notification item. Or whenever a notification item supports email as a
  // notification channel
  context('mobile phone link correct', () => {
    context('when user is missing mobile phone', () => {
      it('should show the correct mobile phone link', () => {
        cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);
        const user = makeMockUser();
        user.data.attributes.vet360ContactInformation.mobilePhone = null;
        cy.login(user);
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.findByRole('progressbar', { name: /loading/i }).should('exist');
        cy.injectAxeThenAxeCheck();

        // and then the loading indicator should be removed
        cy.findByRole('progressbar', { name: /loading/i }).should('not.exist');
        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.findByTestId('missing-contact-info-alert')
          .should('exist')
          .and('contain.text', 'mobile phone')
          .within(() => {
            cy.findByRole('link', { name: /add.*mobile.*profile/i }).should(
              'exist',
            );
          });

        cy.findAllByTestId('add-contact-info-link')
          .should('have.attr', 'href')
          .and('include', PROFILE_PATHS.CONTACT_INFORMATION);

        cy.findByRole('link', { name: /add your email/i }).should('not.exist');
        cy.axeCheck();
      });
    });
  });
});
