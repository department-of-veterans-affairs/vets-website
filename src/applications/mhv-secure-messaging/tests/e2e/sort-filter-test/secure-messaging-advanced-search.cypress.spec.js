import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSearchMessages from '../fixtures/searchResponses/search-COVID-results.json';
import mockSearchCustomMessages from '../fixtures/searchResponses/search-advanced-custom-folder-results.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import FolderLoadPage from '../pages/FolderLoadPage';

describe('Advanced search in Trash', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(mockSearchMessages);
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
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(mockSearchCustomMessages);
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
