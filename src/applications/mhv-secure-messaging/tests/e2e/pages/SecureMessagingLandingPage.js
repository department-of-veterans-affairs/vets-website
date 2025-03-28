import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import { Locators, Paths } from '../utils/constants';

class SecureMessagingLandingPage {
  loadMainPage = (
    featureToggles = mockFeatureToggles,
    url = Paths.UI_MAIN,
    recipients = mockRecipients,
    user = mockUser,
    messages = mockGeneralMessages,
  ) => {
    cy.intercept('GET', Paths.INTERCEPT.FEATURE_TOGGLES, featureToggles).as(
      'featureToggles',
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
      recipients,
    ).as('Recipients');

    cy.intercept('GET', '/v0/user', user).as('user');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0*`,
      mockGeneralFolder,
    ).as('generalFolder');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/messages*`,
      messages,
    ).as('generalMessages');

    cy.visit(url, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
  };

  verifyHeaderText = (text = 'Messages') => {
    cy.get(Locators.HEADER)
      .should('be.visible')
      .and('have.text', `${text}`);
  };

  verifyUnreadMessagesNoteText = (text = 'unread messages in your inbox') => {
    cy.get(Locators.ALERTS.UNREAD_MESS)
      .should('be.visible')
      .and('include.text', `${text}`);
  };

  verifyWelcomeMessageText = (
    text = 'What to know as you try out this tool',
  ) => {
    cy.get(Locators.ALERTS.WELCOME_MESSAGE)
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqMessageText = (text = 'Questions about this messaging tool') => {
    cy.get(Locators.MESSAGE_FAQ)
      .should('be.visible')
      .and('contain.text', `${text}`);
  };

  verifyFaqAccordions = () => {
    cy.get(Locators.FAQ_ACC_ITEM).each(el => {
      cy.wrap(el)
        .should('be.visible')
        .click({ waitForAnimations: true });
      cy.wrap(el).should('have.attr', 'open');
    });
  };

  verifyFaqAccordionStatus = (text, value) => {
    cy.get(`[data-dd-action-name*="${text}"]`).should(
      `have.prop`,
      `open`,
      value,
    );
  };

  verifyFaqFocusedLink = (link, text) => {
    cy.focused()
      .should(`have.attr`, `href`)
      .and(`include`, link);
    cy.focused().should(`have.text`, text);
  };
}

export default new SecureMessagingLandingPage();
