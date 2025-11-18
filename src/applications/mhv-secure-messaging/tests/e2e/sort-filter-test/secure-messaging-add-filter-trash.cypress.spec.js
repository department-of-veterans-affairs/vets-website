import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import { AXE_CONTEXT, Locators, Data, Alerts } from '../utils/constants';
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
    PatientFilterPage.openAdditionalFilter();
    PatientFilterPage.selectAdvancedSearchCategory('Medication');
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);
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
    PatientFilterPage.openAdditionalFilter();
  });

  it('verify filter by last 3 month', () => {
    filterResultResponse = PatientFilterPage.createDateFilterMockResponse(
      2,
      3,
      mockTrashMessages,
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
      mockTrashMessages,
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
      mockTrashMessages,
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
    FolderLoadPage.loadDeletedMessages();
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
