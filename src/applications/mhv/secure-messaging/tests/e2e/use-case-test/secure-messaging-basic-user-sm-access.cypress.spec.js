import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';

describe('Secure Messaging Basic User', () => {
  it('verify basic user has not access to secure-messaging', () => {
    const basicUser = { ...mockUser };
    basicUser.data.attributes.services = basicUser.data.attributes.services.filter(
      service => service !== 'messaging',
    );

    const site = new SecureMessagingSite();
    site.login(true, basicUser);

    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/user', basicUser).as('user');
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
  });
});
