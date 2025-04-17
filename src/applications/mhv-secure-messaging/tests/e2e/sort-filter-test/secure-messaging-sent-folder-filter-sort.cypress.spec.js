import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM SENT FOLDER FILTER-SORT CHECKS', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageSentPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(sentSearchResponse);
    PatientFilterPage.verifyFilterResults('test', sentSearchResponse);
    cy.get(`.unread-icon`).should(`not.exist`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(sentSearchResponse);
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
    PatientMessageSentPage.inputFilterDataText(
      updatedThreadResponse.data[0].attributes.subject,
    );
    PatientMessageSentPage.clickFilterMessagesButton(updatedThreadResponse);
    PatientMessageSentPage.verifySentToField(
      updatedThreadResponse.data[0].attributes.subject,
    );
    cy.injectAxeThenAxeCheck();
  });
});
