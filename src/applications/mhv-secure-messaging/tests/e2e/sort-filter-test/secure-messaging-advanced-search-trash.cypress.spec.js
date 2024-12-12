import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('Advanced search in Trash', () => {
  const searchResultResponse = PatientSearchPage.createCategorySearchMockResponse(
    2,
    'MEDICATIONS',
    mockTrashMessages,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('Medication');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
  });

  it('Check all messages contain the searched category', () => {
    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifySearchResponseCategory('Medication');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check the search message label', () => {
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Medication',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM SENT ADVANCED FIXED DATE RANGE SEARCH', () => {
  let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      2,
      3,
      mockTrashMessages,
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
      mockTrashMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
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
      mockTrashMessages,
    );

    PatientInboxPage.selectDateRange('Last 3 months');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(12);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
