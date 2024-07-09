import manifest from '../../../manifest.json';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSearchMessages from '../fixtures/search-COVID-results.json';
import mockSearchCustomMessages from '../fixtures/search-advanced-custom-folder-results.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatentMessageSentPage from '../pages/PatientMessageSentPage';

describe(manifest.appName, () => {
  describe('Advanced search in Inbox', () => {
    beforeEach(() => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      PatientInboxPage.openAdvancedSearch();
      PatientInboxPage.selectAdvancedSearchCategory('COVID');
      PatientInboxPage.clickSubmitSearchButton();
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
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
      FolderLoadPage.loadDraftMessages();
      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      PatientInboxPage.openAdvancedSearch();
      PatientInboxPage.selectAdvancedSearchCategory('COVID');
      PatientInboxPage.clickSubmitSearchButton();
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
        .should('contain', mockSearchMessages.data.length)
        .and('contain', 'Category: "COVID"');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Advanced search in Sent', () => {
    beforeEach(() => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
      PatentMessageSentPage.loadMessages();

      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      ).as('advancedSearchRequest');
      PatientInboxPage.openAdvancedSearch();
      PatientInboxPage.selectAdvancedSearchCategory('COVID');
      PatientInboxPage.clickSubmitSearchButton();
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
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
      FolderLoadPage.loadDeletedMessages();

      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchMessages,
      );
      PatientInboxPage.openAdvancedSearch();
      PatientInboxPage.selectAdvancedSearchCategory('COVID');
      PatientInboxPage.clickSubmitSearchButton();
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
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
      PatientMessageCustomFolderPage.loadMessages();

      cy.intercept(
        'POST',
        Paths.INTERCEPT.MESSAGE_FOLDERS_SEARCH,
        mockSearchCustomMessages,
      ).as('customFolderSearchResults');

      PatientInboxPage.openAdvancedSearch();
      PatientInboxPage.selectAdvancedSearchCategory('COVID');
      PatientInboxPage.clickSubmitSearchButton();
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
