import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockThreadsResponse from '../fixtures/threads-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('SM CUSTOM FOLDER FILTER-SORT CHECKS', () => {
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockThreadsResponse,
    'test',
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.verifyFilterResults('test', filteredResponse);

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
});
