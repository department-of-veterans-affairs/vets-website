import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import { AXE_CONTEXT, Data } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatentMessageSentPage from '../pages/PatientMessageSentPage';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM SENT ADD FILTER CATEGORY', () => {
  const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
    3,
    'APPOINTMENTS',
    mockSentMessages,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatentMessageSentPage.loadMessages();
    PatientFilterPage.openAdditionalFilter();
    PatientFilterPage.selectAdvancedSearchCategory('Appointment');
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);
  });

  it('verify all sent messages contain the searched category', () => {
    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyFilterResponseCategory('Appointment');
    cy.get(`.unread-icon`).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search message label', () => {
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      'Appointment',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM SENT ADD FILTER FIXED DATE RANGE', () => {
  let filterResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatentMessageSentPage.loadMessages();
    PatientFilterPage.openAdditionalFilter();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      3,
      mockSentMessages,
    );

    PatientFilterPage.selectDateRange(Data.DATE_RANGE.THREE_MONTHS);
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);

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
      mockSentMessages,
    );

    PatientFilterPage.selectDateRange(Data.DATE_RANGE.SIX_MONTHS);
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);

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
      mockSentMessages,
    );

    PatientFilterPage.selectDateRange(Data.DATE_RANGE.TWELVE_MONTHS);
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);

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
