import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';

describe('SM main page', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify headers', () => {
    cy.injectAxe();

    SecureMessagingLandingPage.verifyHeader();
    SecureMessagingLandingPage.verifyUnreadMessagesNote();
  });

  it('verify main topics', () => {
    cy.injectAxe();

    SecureMessagingLandingPage.verifyWelcomeMessage();
    SecureMessagingLandingPage.verifyFaqMessage();
  });

  it('verify faq accordions', () => {
    cy.injectAxe();

    SecureMessagingLandingPage.verifyFaqAccordions();
  });

  it('verify "Start a new message" link', () => {
    cy.injectAxe();

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    cy.location('pathname').should('contain', 'new-message');
  });

  it('verify "Go to the inbox" link', () => {
    cy.injectAxe();

    cy.get(Locators.LINKS.GO_TO_INBOX).click({ force: true });
    cy.location('pathname').should('contain', 'inbox');
  });
});

describe('SM main page without API calls', () => {
  it('validate Inbox and New Message links exists in the page', () => {
    const site = new SecureMessagingSite();
    site.login();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/allrecipients',
      mockRecipients,
    ).as('Recipients');
    cy.visit('my-health/secure-messages/');

    cy.get(Locators.LINKS.GO_TO_INBOX).should('be.visible');
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('be.visible');

    cy.injectAxe();
  });
});
