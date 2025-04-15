import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientFilterPage from '../pages/PatientFilterPage';

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
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, -3);
    PatientFilterPage.verifyFilterResults('test', filteredData);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, -3);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(
      mockTrashMessages,
    );

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
