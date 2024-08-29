import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import FolderLoadPage from './pages/FolderLoadPage';
import { Assertions, AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';

describe('SM main page', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('verify headers', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyHeaderText();
    SecureMessagingLandingPage.verifyUnreadMessagesNoteText();
  });

  it('verify main topics', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyWelcomeMessageText();
    SecureMessagingLandingPage.verifyFaqMessageText();
  });

  it('verify faq accordions', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    SecureMessagingLandingPage.verifyFaqAccordions();
  });

  it('verify "Start a new message" link', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    cy.location('pathname').should('contain', Assertions.NEW_MESSAGE);
  });

  it('verify "Go to the inbox" link', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Locators.LINKS.GO_TO_INBOX).click({ force: true });
    cy.location('pathname').should('contain', 'inbox');
  });

  it('verify breadcrumbs', () => {
    FolderLoadPage.verifyBreadCrumbsLength(3);

    FolderLoadPage.verifyBreadCrumbText(0, 'VA.gov home');
    FolderLoadPage.verifyBreadCrumbText(1, 'My HealtheVet');
    FolderLoadPage.verifyBreadCrumbText(2, 'Messages');
  });
});

describe('SM main page without API calls', () => {
  it('validate Inbox and New Message links exists in the page', () => {
    SecureMessagingSite.login();
    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('Recipients');
    cy.visit('my-health/secure-messages/');

    cy.get(Locators.LINKS.GO_TO_INBOX).should('be.visible');
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
