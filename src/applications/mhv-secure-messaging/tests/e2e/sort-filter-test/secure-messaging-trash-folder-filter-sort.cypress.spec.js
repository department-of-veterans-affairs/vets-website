import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageTrashPage from '../pages/PatientMessageTrashPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import { AXE_CONTEXT } from '../utils/constants';
import trashSearchResponse from '../fixtures/trashResponse/trash-search-response.json';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';

describe('Secure Messaging Trash Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('Verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(trashSearchResponse);
    PatientFilterPage.verifyFilterResults('test', trashSearchResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(trashSearchResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    const sortedResponse = {
      ...mockTrashMessages,
      data: [...mockTrashMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageTrashPage.verifySorting('Oldest to newest', sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
