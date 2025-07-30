import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM DRAFT FILTER & SORT KB NAVIGATION', () => {
  const filterData = 'test';
  const filteredData = PatientFilterPage.filterMockResponse(
    mockDraftMessages,
    filterData,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadDraftMessages(mockDraftMessages);
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard(filterData);
    PatientFilterPage.submitFilterByKeyboard(filteredData, -2);
    PatientFilterPage.verifyFilterResults(filterData, filteredData);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard(filterData);
    PatientFilterPage.submitFilterByKeyboard(filteredData, -2);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(
      mockDraftMessages,
      'draftDate',
    );

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
