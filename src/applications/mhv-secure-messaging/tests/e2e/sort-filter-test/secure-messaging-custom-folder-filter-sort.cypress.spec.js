import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockThreadsResponse from '../fixtures/threads-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('SM CUSTOM FOLDER FILTER-SORT CHECKS', () => {
  const filterData = 'test';
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockThreadsResponse,
    filterData,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(filterData);
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.verifyFilterResults(filterData, filteredResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('check sorting works properly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(
      mockThreadsResponse,
    );

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify filter with no matches', () => {
    const noMatchResponse = PatientFilterPage.filterMockResponse(
      mockThreadsResponse,
      'no match',
    );

    PatientFilterPage.inputFilterData('no match');
    PatientFilterPage.clickApplyFilterButton(noMatchResponse);

    PatientFilterPage.verifyNoMatchFilterFocusAndText();
  });
});
