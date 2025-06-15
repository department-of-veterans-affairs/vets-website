import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMessages from '../fixtures/threads-response.json';
import { AXE_CONTEXT, Data } from '../utils/constants';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM INBOX ADD FILTER CATEGORY', () => {
  const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
    6,
    'COVID',
    mockMessages,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientFilterPage.openAdditionalFilter();
    PatientFilterPage.selectAdvancedSearchCategory('COVID');
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);
  });

  it('verify all inbox messages contain the searched category', () => {
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

describe('SM INBOX ADD FILTER FIXED DATE RANGE', () => {
  let filterResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientFilterPage.openAdditionalFilter();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(2, 3);

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
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(3, 6);

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
      5,
      12,
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
