import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageTrashPage from '../pages/PatientMessageTrashPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';

describe('Secure Messaging Trash Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('Verify filter works correctly', () => {
    PatientMessageTrashPage.inputFilterDataText('test');
    PatientMessageTrashPage.clickFilterMessagesButton();
    PatientMessageTrashPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessageTrashPage.inputFilterDataText('any');
    PatientMessageTrashPage.clickFilterMessagesButton();
    PatientMessageTrashPage.clickClearFilterButton();
    PatientMessageTrashPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
