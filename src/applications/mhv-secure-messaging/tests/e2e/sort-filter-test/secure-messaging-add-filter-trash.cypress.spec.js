import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import { AXE_CONTEXT, Data } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM TRASH ADVANCED CATEGORY SEARCH', () => {
  const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
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
    PatientInboxPage.clickFilterMessagesButton(filterResultResponse);
  });

  it('verify all messages contain the searched category', () => {
    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyFilterResponseCategory('Medication');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      'Medication',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM TRASH ADVANCED FIXED DATE RANGE SEARCH', () => {
  let filterResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();
    PatientInboxPage.openAdvancedSearch();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      3,
      mockTrashMessages,
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
      mockTrashMessages,
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
      mockTrashMessages,
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
