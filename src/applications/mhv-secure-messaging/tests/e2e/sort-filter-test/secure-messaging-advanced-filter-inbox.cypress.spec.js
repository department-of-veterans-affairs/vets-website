import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Data } from '../utils/constants';
import PatientSearchPage from '../pages/PatientSearchPage';

describe('SM INBOX ADVANCED CATEGORY SEARCH', () => {
  const searchResultResponse = PatientSearchPage.createCategorySearchMockResponse(
    6,
    'COVID',
    mockMessages,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
    PatientInboxPage.selectAdvancedSearchCategory('COVID');
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);
  });

  it('verify all inbox messages contain the searched category', () => {
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

describe('SM INBOX ADVANCED FIXED DATE RANGE SEARCH', () => {
  let searchResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(2, 3);

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.THREE_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(3);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      Data.DATE_RANGE.THREE_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 6 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(3, 6);

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.SIX_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(6);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      Data.DATE_RANGE.SIX_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    searchResultResponse = PatientSearchPage.createDateSearchMockResponse(
      5,
      12,
    );

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.TWELVE_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(searchResultResponse);

    PatientSearchPage.verifySearchResponseLength(searchResultResponse);
    PatientSearchPage.verifyMessageDate(12);
    PatientSearchPage.verifySearchMessageLabel(
      searchResultResponse,
      Data.DATE_RANGE.TWELVE_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
