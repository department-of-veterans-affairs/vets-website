import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import { AXE_CONTEXT } from '../utils/constants';
import trashSearchResponse from '../fixtures/trashResponse/trash-search-response.json';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';

describe('SM TRASH FOLDER FILTER-SORT CHECKS', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(trashSearchResponse);
    PatientFilterPage.verifyFilterResults('test', trashSearchResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(trashSearchResponse);
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
});
