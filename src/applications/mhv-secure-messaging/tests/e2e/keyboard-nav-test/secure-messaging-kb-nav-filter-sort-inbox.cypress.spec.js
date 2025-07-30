import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMessages from '../fixtures/threads-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM INBOX FILTER & SORT KB NAVIGATION', () => {
  const filterData = 'test';
  const filteredData = PatientFilterPage.filterMockResponse(
    mockMessages,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, 0);
    PatientFilterPage.verifyFilterResults('test', filteredData);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, 0);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(mockMessages);

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
