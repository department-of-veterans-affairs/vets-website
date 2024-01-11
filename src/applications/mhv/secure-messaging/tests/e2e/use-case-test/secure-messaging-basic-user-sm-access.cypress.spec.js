import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockBasicUser from '../fixtures/userResponse/basic-user.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';

describe('Secure Messaging Basic User', () => {
  it('verify user has not access to secure-messaging', () => {
    const site = new SecureMessagingSite();
    site.login(true, mockBasicUser);

    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/user', mockBasicUser).as('user');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockGeneralFolder,
    ).as('generalFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      mockGeneralMessages,
    ).as('generalMessages');

    cy.visit('my-health/secure-messages/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.location('pathname').should('eq', '/health-care/secure-messaging');
    cy.get('body').should(
      'contain.text',
      'Cannot GET /health-care/secure-messaging',
    );
  });
});
