import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockRecipients from '../fixtures/recipients-response.json';
import { Locators, Paths } from '../utils/constants';

class SecureMessagingLandingPage {
  loadMainPage = (
    featureToggles = mockFeatureToggles,
    url = Paths.UI_MAIN,
    recipients = mockRecipients,
    user = mockUser,
    messages = mockGeneralMessages,
  ) => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
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

    cy.visit(url, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
    cy.wait('@generalFolder');
  };

  verifyHeader = (text = 'Messages') => {
    cy.get(Locators.HEADER)
      .should('be.visible')
      .and('have.text', `${text}`);
  };

  verifyUnreadMessagesNote = (text = 'unread messages in your inbox') => {
    cy.get(Locators.ALERTS.UNREAD_MESS)
      .should('be.visible')
      .and('include.text', `${text}`);
  };

  verifyWelcomeMessage = (text = 'What to know as you try out this tool') => {
    cy.get(Locators.ALERTS.WELCOME_MESSAGE)
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqMessage = (text = 'Questions about this messaging tool') => {
    cy.get(Locators.MESSAGE_FAQ)
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqAccordions = () => {
    cy.get(Locators.ALERTS.ACC_ITEM).each(el => {
      cy.wrap(el)
        .should('be.visible')
        .click({ waitForAnimations: true });
      cy.wrap(el).should('have.attr', 'open');
    });
  };
}

export default new SecureMessagingLandingPage();
