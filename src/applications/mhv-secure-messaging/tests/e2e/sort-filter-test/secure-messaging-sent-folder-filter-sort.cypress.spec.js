import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('Secure Messaging Trash Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageSentPage.loadMessages();
  });

  it('Verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(sentSearchResponse);
    PatientFilterPage.verifyFilterResults('test', sentSearchResponse);
    cy.get(`.unread-icon`).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(sentSearchResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessageSentPage.loadMessages();
    const sortedResponse = {
      ...mockSentMessages,
      data: [...mockSentMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageSentPage.verifySorting('Oldest to newest', sortedResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
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
