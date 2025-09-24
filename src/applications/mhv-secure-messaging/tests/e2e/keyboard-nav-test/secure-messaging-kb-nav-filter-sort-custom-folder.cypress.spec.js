import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockThreadsResponse from '../fixtures/threads-response.json';

describe('SM CUSTOM FOLDER FILTER & SORT KB NAVIGATION', () => {
  const filterData = 'test';
  const filteredData = PatientFilterPage.filterMockResponse(
    mockThreadsResponse,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard(filterData);
    PatientFilterPage.submitFilterByKeyboard(filteredData);
    PatientFilterPage.verifyFilterResults(filterData, filteredData);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard(filterData);
    PatientFilterPage.submitFilterByKeyboard(filteredData);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(
      mockThreadsResponse,
    );

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
