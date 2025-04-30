import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';

describe('SM TRASH FOLDER FILTER-SORT CHECKS', () => {
  const filterData = 'test';
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockTrashMessages,
    filterData,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('verify filter works correctly', () => {
    cy.log(filteredResponse.data.length);
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
      mockTrashMessages,
    );

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify filter with no matches', () => {
    const noMatchResponse = PatientFilterPage.filterMockResponse(
      mockTrashMessages,
      'no match',
    );

    PatientFilterPage.inputFilterData('no match');
    PatientFilterPage.clickApplyFilterButton(noMatchResponse);

    PatientFilterPage.verifyNoMatchFilterFocusAndText();
  });
});
