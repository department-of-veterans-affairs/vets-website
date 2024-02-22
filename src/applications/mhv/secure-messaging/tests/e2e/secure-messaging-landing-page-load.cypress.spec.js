import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import { AXE_CONTEXT, Constants } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';

describe('SM main page', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('verify headers', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyHeader();
    SecureMessagingLandingPage.verifyUnreadMessagesNote();
  });

  it('verify main topics', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyWelcomeMessage();
    SecureMessagingLandingPage.verifyFaqMessage();
  });

  it('verify faq accordions', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyFaqAccordions();
  });

  it('verify "Start a new message" link', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Constants.LINKS.CREATE_NEW_MESSAGE).click();
    cy.location('pathname').should('contain', 'new-message');
  });

  it('verify "Go to the inbox" link', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Constants.LINKS.GO_TO_INBOX).click({ force: true });
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

    cy.get(Constants.LINKS.GO_TO_INBOX).should('be.visible');
    cy.get(Constants.LINKS.CREATE_NEW_MESSAGE).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
