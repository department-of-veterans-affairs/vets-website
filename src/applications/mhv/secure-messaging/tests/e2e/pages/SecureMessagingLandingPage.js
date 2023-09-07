import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';

class SecureMessagingLandingPage {
  loadMainPage = (user = mockUser, messages = mockGeneralMessages) => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/user', user).as('user');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockGeneralFolder,
    ).as('generalFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      messages,
    ).as('generalMessages');

    cy.visit('my-health/secure-messages/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
    cy.wait('@generalFolder');
  };

  verifyHeader = (text = 'Messages') => {
    cy.get('h1')
      .should('be.visible')
      .and('have.text', `${text}`);
  };
}

export default new SecureMessagingLandingPage();
