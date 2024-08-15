import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import { Locators, AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Folder filter-sort checks', () => {
  const {
    data: [, secondElement, thirdElement],
    ...rest
  } = mockMessages;

  const mockFilterResults = { data: [secondElement, thirdElement], ...rest };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify filter works correctly', () => {
    PatientInboxPage.inputFilterData('test');
    PatientInboxPage.clickFilterMessagesButton(mockFilterResults);
    PatientInboxPage.verifyFilterResults('test', mockFilterResults);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientInboxPage.inputFilterData('test');
    PatientInboxPage.clickFilterMessagesButton(mockFilterResults);
    PatientInboxPage.clickClearFilterButton();
    PatientInboxPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works correctly', () => {
    const sortedResponse = {
      ...mockMessages,
      data: [...mockMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };
    PatientInboxPage.verifySorting('Oldest to newest', sortedResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('verify sorting feature with only one filter result', () => {
  const {
    data: [, secondElement],
    ...rest
  } = mockMessages;

  const mockSingleFilterResult = { data: [secondElement], ...rest };

  it('verify sorting does not appear with only one filter result', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.inputFilterData('draft');
    PatientInboxPage.clickFilterMessagesButton(mockSingleFilterResult);
    PatientInboxPage.verifyFilterResults('draft', mockSingleFilterResult);

    cy.get(Locators.DROPDOWN).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
