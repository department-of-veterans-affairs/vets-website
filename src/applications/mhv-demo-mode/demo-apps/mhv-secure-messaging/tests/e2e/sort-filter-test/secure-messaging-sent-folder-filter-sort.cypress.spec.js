import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM SENT FOLDER FILTER-SORT CHECKS', () => {
  const filterData = 'test';
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockSentMessages,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    PatientMessageSentPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(filterData);
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.verifyFilterResults(filterData, filteredResponse);
    cy.get(`.unread-icon`).should(`not.exist`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(filteredResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('check sorting works properly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(
      mockSentMessages,
    );

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify filter with no matches', () => {
    const noMatchResponse = PatientFilterPage.filterMockResponse(
      mockSentMessages,
      'no match',
    );

    PatientFilterPage.inputFilterData('no match');
    PatientFilterPage.clickApplyFilterButton(noMatchResponse);

    PatientFilterPage.verifyNoMatchFilterFocusAndText();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe('SM SENT FOLDER PLAIN TG NAME FILTERING', () => {
  const updatedThreadResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockSentMessages,
    'TG | Type | Name',
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageSentPage.loadMessages(updatedThreadResponse);
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData(
      updatedThreadResponse.data[0].attributes.subject,
    );
    PatientFilterPage.clickApplyFilterButton(updatedThreadResponse);
    PatientMessageSentPage.verifySentToFieldContainsPalinTGName(
      updatedThreadResponse.data[0].attributes.subject,
    );

    cy.injectAxeThenAxeCheck();
  });
});
