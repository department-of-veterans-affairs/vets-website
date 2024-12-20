import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatentMessageSentPage from '../pages/PatientMessageSentPage';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM SENT ADVANCED CATEGORY SEARCH', () => {
  const searchResultResponse = PatientSearchPage.createCategorySearchMockResponse(
    3,
    'APPOINTMENTS',
    mockSentMessages,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatentMessageSentPage.loadMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('Appointment');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
  });

  it('verify all sent messages contain the searched category', () => {
    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifySearchResponseCategory('Appointment');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      'Appointment',
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
    PatentMessageSentPage.loadMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      2,
      3,
      mockSentMessages,
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
      mockSentMessages,
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
      mockSentMessages,
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
