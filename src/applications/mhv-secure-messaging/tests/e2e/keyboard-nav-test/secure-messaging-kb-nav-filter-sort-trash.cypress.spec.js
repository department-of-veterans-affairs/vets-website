import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageTrashPage from '../pages/PatientMessageTrashPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM TRASH FILTER & SORT KB NAVIGATION', () => {
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientMessageTrashPage.inputFilterDataByKeyboard('test');
    PatientMessageTrashPage.submitFilterByKeyboard(filteredData, -3);
    PatientMessageTrashPage.verifyFilterResults('test', filteredData);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientMessageTrashPage.inputFilterDataByKeyboard('test');
    PatientMessageTrashPage.submitFilterByKeyboard(filteredData, -3);
    PatientMessageTrashPage.clearFilterByKeyboard();
    PatientMessageTrashPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const testData = {
      data: Array.from(mockTrashMessages.data).sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageTrashPage.verifySortingByKeyboard(
      'Oldest to newest',
      testData,
      -3,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
