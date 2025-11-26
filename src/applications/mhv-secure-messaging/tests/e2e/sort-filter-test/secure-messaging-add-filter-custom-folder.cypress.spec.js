import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { AXE_CONTEXT, Locators, Data, Alerts } from '../utils/constants';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM CUSTOM FOLDER ADD FILTER CATEGORY', () => {
  const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
    1,
    'EDUCATION',
    mockSingleThreadResponse,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
    PatientFilterPage.openAdditionalFilter();
    PatientFilterPage.selectAdvancedSearchCategory('Education');
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);
  });

  it('verify all messages contain the searched category', () => {
    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);
    PatientFilterPage.verifyFilterResponseCategory('Education');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify the search results label', () => {
    PatientFilterPage.verifyFilterMessageLabel(
      filterResultResponse,
      'Education',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM CUSTOM FOLDER ADD FILTER FIXED DATE RANGE', () => {
  let filterResultResponse;
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
    PatientFilterPage.openAdditionalFilter();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      3,
      mockSingleThreadResponse,
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
      mockSingleThreadResponse,
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
      mockSingleThreadResponse,
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

describe('SM FILTER ERROR', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('focuses on relevant error', () => {
    cy.get(Locators.BUTTONS.FILTER).click();
    cy.get(Locators.BLOCKS.FILTER_KEYWORD_INPUT).should('be.focused');
    cy.get(Locators.BLOCKS.FILTER_KEYWORD_INPUT)
      .invoke('attr', 'error')
      .then(errorAttr => {
        expect(errorAttr).to.equal(Alerts.SEARCH_TERM_REQUIRED);
      });
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('clears keyword error on filter clear', () => {
    cy.get(Locators.BUTTONS.FILTER).click();
    cy.get(Locators.BLOCKS.FILTER_KEYWORD_INPUT)
      .invoke('attr', 'error')
      .then(errorAttr => {
        expect(errorAttr).to.equal(Alerts.SEARCH_TERM_REQUIRED);
      });
    cy.get(Locators.CLEAR_FILTERS).click();
    cy.get(Locators.BLOCKS.FILTER_KEYWORD_INPUT)
      .invoke('attr', 'error')
      .then(errorAttr => {
        expect(errorAttr).to.not.exist;
      });
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
