import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM DRAFT FOLDER FILTER-SORT CHECKS', () => {
  const filterData = 'test';
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockDraftMessages,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadDraftMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(filterData);
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.verifyFilterResults(filterData, filteredResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton();
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(
      mockDraftMessages,
      'draftDate',
    );

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify filter with no matches', () => {
    const noMatchResponse = PatientFilterPage.filterMockResponse(
      mockDraftMessages,
      'no match',
    );

    PatientFilterPage.inputFilterData('no match');
    PatientFilterPage.clickApplyFilterButton(noMatchResponse);

    PatientFilterPage.verifyNoMatchFilterFocusAndText();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe('SM DRAFT FOLDER PLAIN TG NAME FILTERING', () => {
  const updatedThreadResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockDraftMessages,
    'TG | Type | Name',
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadDraftMessages(updatedThreadResponse);
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(
      updatedThreadResponse.data[0].attributes.subject,
    );
    PatientFilterPage.clickApplyFilterButton(updatedThreadResponse);

    PatientMessageDraftsPage.verifyDraftToFieldContainsPlainTGName(
      updatedThreadResponse.data[0].attributes.subject,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
