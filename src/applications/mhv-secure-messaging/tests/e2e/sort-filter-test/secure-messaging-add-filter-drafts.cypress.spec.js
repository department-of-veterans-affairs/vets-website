import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import { AXE_CONTEXT, Data } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM DRAFTS ADD FILTER CATEGORY', () => {
  const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
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
    PatientInboxPage.clickFilterMessagesButton(filterResultResponse);
  });

  it('verify all draft messages contain the searched category', () => {
    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyFilterResponseCategory('COVID');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    PatientFilterPage.verifyFilterMessageLabel(filterResultResponse, 'COVID');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM DRAFTS ADD FILTER FIXED DATE RANGE', () => {
  let filterResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      3,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.THREE_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(filterResultResponse);

    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyMessageDate(3);
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      Data.DATE_RANGE.THREE_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 6 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      3,
      6,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.SIX_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(filterResultResponse);

    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyMessageDate(6);
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      Data.DATE_RANGE.SIX_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify filter by last 12 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      6,
      12,
      mockDraftMessages,
    );

    PatientInboxPage.selectDateRange(Data.DATE_RANGE.TWELVE_MONTHS);
    PatientInboxPage.clickFilterMessagesButton(filterResultResponse);

    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyMessageDate(12);
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      Data.DATE_RANGE.TWELVE_MONTHS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
