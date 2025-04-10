import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import FolderLoadPage from './pages/FolderLoadPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { Assertions, AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';

describe('SM MAIN PAGE', () => {
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

  it('verify previous version link', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Locators.LINKS.OLD_VERSION)
      .should(`not.have.attr`, `target`, `_blank`)
      .invoke(`attr`, `href`)
      .should(`contain`, `mhv-portal-web/secure-messaging`);
  });

  it('verify breadcrumbs', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    FolderLoadPage.verifyBreadCrumbsLength(3);

    FolderLoadPage.verifyBreadCrumbText(0, 'VA.gov home');
    FolderLoadPage.verifyBreadCrumbText(1, 'My HealtheVet');
    FolderLoadPage.verifyBreadCrumbText(2, 'Messages');
  });
});

describe('SM MAIN PAGE WITHOUT API CALLS', () => {
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
    cy.axeCheck(AXE_CONTEXT);
  });

  describe('SM MAIN PAGE REDIRECTING', () => {
    it('verify redirecting to inbox with feature flag', () => {
      const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
        { name: 'mhv_secure_messaging_remove_landing_page', value: true },
      ]);
      SecureMessagingSite.login(updatedFeatureToggle);
      SecureMessagingLandingPage.loadMainPage(updatedFeatureToggle);

      cy.url().should(`include`, Paths.INBOX);

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
