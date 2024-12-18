import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM CUSTOM FOLDER ADVANCED CATEGORY SEARCH', () => {
  const searchResultResponse = PatientSearchPage.createCategorySearchMockResponse(
    1,
    'EDUCATION',
    mockSingleThreadResponse,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('Education');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
  });

  it('verify all messages contain the searched category', () => {
    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifySearchResponseCategory('Education');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search results label', () => {
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Education',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM CUSTOM FOLDER ADVANCED FIXED DATE RANGE SEARCH', () => {
  let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      2,
      3,
      mockSingleThreadResponse,
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
      mockSingleThreadResponse,
    );

    PatientInboxPage.selectDateRange('Last 6 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(6);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      6,
      12,
      mockSingleThreadResponse,
    );

    PatientInboxPage.selectDateRange('Last 12 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(12);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
