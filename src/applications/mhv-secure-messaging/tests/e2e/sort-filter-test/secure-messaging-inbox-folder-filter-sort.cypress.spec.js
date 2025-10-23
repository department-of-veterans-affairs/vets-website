import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/threads-response.json';
import { Locators, AXE_CONTEXT } from '../utils/constants';
import PatientFilterPage from '../pages/PatientFilterPage';

describe('SM INBOX FOLDER FILTER-SORT CHECKS', () => {
  const filterData = 'test';
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockMessages,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(filterData);
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.verifyFilterResults(filterData, filteredResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData(filterData);
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works correctly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(mockMessages);

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify filter with no matches', () => {
    const noMatchResponse = PatientFilterPage.filterMockResponse(
      mockMessages,
      'no match',
    );

    PatientFilterPage.inputFilterData('no match');
    PatientFilterPage.clickApplyFilterButton(noMatchResponse);

    PatientFilterPage.verifyNoMatchFilterFocusAndText();
  });
});

describe('SM SORTING WITH ONLY ONE MESSAGE', () => {
  const {
    data: [, secondElement],
    ...rest
  } = mockMessages;

  const mockSingleFilterResult = { data: [secondElement], ...rest };

  it('verify sorting does not appear with only one filter result', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientFilterPage.inputFilterData('draft');
    PatientFilterPage.clickApplyFilterButton(mockSingleFilterResult);
    PatientFilterPage.verifyFilterResults('draft', mockSingleFilterResult);

    cy.get(Locators.DROPDOWN.SORT).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
