import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/threads-response.json';
import { Locators, AXE_CONTEXT } from '../utils/constants';
import PatientFilterPage from '../pages/PatientFilterPage';

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
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(mockFilterResults);
    PatientFilterPage.verifyFilterResults('test', mockFilterResults);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(mockFilterResults);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
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

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
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

    PatientFilterPage.inputFilterData('draft');
    PatientFilterPage.clickApplyFilterButton(mockSingleFilterResult);
    PatientFilterPage.verifyFilterResults('draft', mockSingleFilterResult);

    cy.get(Locators.DROPDOWN.SORT).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
