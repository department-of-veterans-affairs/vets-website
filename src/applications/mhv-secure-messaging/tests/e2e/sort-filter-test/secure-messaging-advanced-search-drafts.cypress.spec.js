import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSearchMessages from '../fixtures/searchResponses/search-COVID-results.json';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM DRAFTS ADVANCED CATEGORY SEARCH', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(mockSearchMessages);
  });

  it('verify all draft messages contain the searched category', () => {
    cy.get(Locators.MESSAGES)
      .should('contain', 'COVID')
      .and('have.length', mockSearchMessages.data.length);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    cy.get(Locators.FOLDERS.FOLDER_INPUT_LABEL)
      .should('contain', mockSearchMessages.data.length)
      .and('contain', 'Category: "COVID"');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM DRAFTS ADVANCED FIXED DATE RANGE SEARCH', () => {
  let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientSearchPage.createSearchMockResponse(
      2,
      3,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(3);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 6 month', () => {
    searchResultResponse = PatientSearchPage.createSearchMockResponse(
      3,
      6,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(6);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    searchResultResponse = PatientSearchPage.createSearchMockResponse(
      6,
      12,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(12);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
