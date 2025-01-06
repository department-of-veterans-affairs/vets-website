import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM DRAFTS ADVANCED CATEGORY SEARCH', () => {
  const searchResultResponse = PatientSearchPage.createCategorySearchMockResponse(
    4,
    'COVID',
    mockDraftMessages,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
  });

  it('verify all draft messages contain the searched category', () => {
    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifySearchResponseCategory('COVID');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    PatientSearchPage.verifySearchMessageLabel(searchResultResponse, 'COVID');
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
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      2,
      3,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(3);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Last 3 months',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 6 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      3,
      6,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 6 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(6);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Last 6 months',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      6,
      12,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange('Last 12 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(12);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Last 12 months',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
