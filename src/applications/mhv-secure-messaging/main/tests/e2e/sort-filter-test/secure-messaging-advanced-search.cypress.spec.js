import manifest from '../../../manifest.json';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockDraftsFolder from '../fixtures/folder-drafts-metadata.json';
import mockSentFolder from '../fixtures/sentResponse/folder-sent-metadata.json';
import particularFolderResponse from '../fixtures/drafts-response.json';
import mockSearchMessages from '../fixtures/search-COVID-results.json';
import mockSearchCustomMessages from '../fixtures/search-advanced-custom-folder-results.json';
import mockTrashFolder from '../fixtures/trashResponse/folder-deleted-metadata.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';

describe(manifest.appName, () => {
  describe('Advanced search in Inbox', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const landingPage = new PatientInboxPage();
      site.login();
      landingPage.loadInboxMessages();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      landingPage.openAdvancedSearch();
      landingPage.selectAdvancedSearchCategory('COVID');
      landingPage.clickSubmitSearchButton();
    });
    it('Check all inbox messages contain the searched category', () => {
      cy.get(Locators.MESSAGES)
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
    it('Check the search message label', () => {
      cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
        .should('contain', '4')
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
  describe('Advanced search in Drafts', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const landingPage = new PatientInboxPage();
      site.login();
      landingPage.loadInboxMessages();
      cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDERS_2, mockDraftsFolder);
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-2/threads?**',
        particularFolderResponse,
      );
      cy.get(Locators.FOLDERS.DRAFTS).click();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      landingPage.openAdvancedSearch();
      landingPage.selectAdvancedSearchCategory('COVID');
      landingPage.clickSubmitSearchButton();
    });
    it('Check all draft messages contain the searched category', () => {
      cy.get(Locators.MESSAGES)
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
    it('Check the search message label', () => {
      cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
        .should('contain', '4')
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
  describe('Advanced search in Sent', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      site.login();
      const landingPage = new PatientInboxPage();
      landingPage.loadInboxMessages();
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-1*',
        mockSentFolder,
      ).as('basicSearchRequestDraftsMeta');
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-1/threads?**',
        particularFolderResponse,
      );
      cy.get(Locators.FOLDERS.SENT).click();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      ).as('advancedSearchRequest');
      landingPage.openAdvancedSearch();
      landingPage.selectAdvancedSearchCategory('COVID');
      landingPage.clickSubmitSearchButton();
    });
    it('Check all sent messages contain the searched category', () => {
      cy.get(Locators.MESSAGES)
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
    it('Check the search message label', () => {
      cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
        .should('contain', '4')
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
  describe('Advanced search in Trash', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      site.login();
      const landingPage = new PatientInboxPage();
      landingPage.loadInboxMessages();
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-3*',
        mockTrashFolder,
      );
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-3/threads?**',
        particularFolderResponse,
      );
      cy.get(Locators.FOLDERS.TRASH).click();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      landingPage.openAdvancedSearch();
      landingPage.selectAdvancedSearchCategory('COVID');
      landingPage.clickSubmitSearchButton();
    });
    it('Check all messages contain the searched category', () => {
      cy.get(Locators.MESSAGES)
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
    it('Check the search message label', () => {
      cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
        .should('contain', '4')
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
  describe('Advanced search in Custom folder', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      site.login();
      const landingPage = new PatientInboxPage();
      landingPage.loadInboxMessages();
      PatientMessageCustomFolderPage.loadFoldersList();
      PatientMessageCustomFolderPage.loadMessages('TestFolder3');

      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchCustomMessages,
      ).as('customFolderSearchResults');

      landingPage.openAdvancedSearch();
      landingPage.selectAdvancedSearchCategory('COVID');
      landingPage.clickSubmitSearchButton();
    });
    it('Check all messages contain the searched category', () => {
      cy.get(Locators.MESSAGES)
        .should('contain', 'COVID')
        .and('have.length', mockSearchCustomMessages.data.length);
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
    it('Check the search results label', () => {
      cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
        .should('contain', '2')
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
