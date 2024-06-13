import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageTrashPage from '../pages/PatientMessageTrashPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';
// import below have to be deleted after merge with MHV-57520
import mockMessages from '../fixtures/messages-response.json';

describe('Keyboard Navigation for Filter & Sort functionalities', () => {
  const site = new SecureMessagingSite();
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageTrashPage.inputFilterDataByKeyboard('test');
    PatientMessageTrashPage.submitFilterByKeyboard(filteredData, -3);
    PatientMessageTrashPage.verifyFilterResults('test', filteredData);
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageTrashPage.inputFilterDataByKeyboard('test');
    PatientMessageTrashPage.submitFilterByKeyboard(filteredData, -3);
    PatientMessageTrashPage.clearFilterByKeyboard();
    PatientMessageTrashPage.verifyFilterFieldCleared();
  });

  it('verify sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    // mockMessages.data shuld be replaced by mockTrashMessages.data after merge with MHV-57520
    const testData = {
      data: Array.from(mockMessages.data).sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageTrashPage.verifySortingByKeyboard(
      'Oldest to newest',
      testData,
      -3,
    );
  });
});
