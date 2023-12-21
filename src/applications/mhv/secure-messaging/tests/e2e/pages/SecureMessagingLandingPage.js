import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockRecipients from '../fixtures/recipients-response.json';

class SecureMessagingLandingPage {
  loadMainPage = (
    recipients = mockRecipients,
    user = mockUser,
    messages = mockGeneralMessages,
  ) => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/my_health/v1/messaging/allrecipients', recipients).as(
      'Recipients',
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

  verifyUnreadMessagesNote = (text = 'unread messages in your inbox') => {
    cy.get('[data-testid="unread-messages"]')
      .should('be.visible')
      .and('include.text', `${text}`);
  };

  verifyWelcomeMessage = (text = 'What to know as you try out this tool') => {
    cy.get('.welcome-message')
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqMessage = (text = 'Questions about this messaging tool') => {
    cy.get('.secure-messaging-faq')
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqAccordions = () => {
    cy.get('[data-testid="faq-accordion-item"]').each(el => {
      cy.wrap(el)
        .should('be.visible')
        .click({ waitForAnimations: true });
      cy.wrap(el).should('have.attr', 'open');
    });
  };
}

export default new SecureMessagingLandingPage();
