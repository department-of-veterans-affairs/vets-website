import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockThreadsResponse from '../fixtures/threads-response.json';

describe('SM TRASH FILTER & SORT KB NAVIGATION', () => {
  const filterData = 'test';
  const filteredData = PatientFilterPage.filterMockResponse(
    mockThreadsResponse,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockTrashMessages);
    FolderLoadPage.loadDeletedMessages(mockTrashMessages);
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard(filterData);
    PatientFilterPage.submitFilterByKeyboard(filteredData, -3);
    PatientFilterPage.verifyFilterResults(filterData, filteredData);

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
