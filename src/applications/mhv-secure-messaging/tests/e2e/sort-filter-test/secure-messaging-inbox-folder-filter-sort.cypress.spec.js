import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import { Locators, AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  const {
    data: [, secondElement, thirdElement],
    ...rest
  } = mockMessages;

  const mockFilterResults = { data: [secondElement, thirdElement], ...rest };

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });

  it('Verify filter works correctly', () => {
    landingPage.inputFilterData('test');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.verifyFilterResults('test', mockFilterResults);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    landingPage.inputFilterData('test');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.clickClearFilterButton();
    landingPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    landingPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('Verify sorting feature with only one filter result', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  const {
    data: [, secondElement],
    ...rest
  } = mockMessages;

  const mockSingleFilterResult = { data: [secondElement], ...rest };

  it('verify sorting does not appear with only one filter result', () => {
    site.login();
    landingPage.loadInboxMessages();

    landingPage.inputFilterData('draft');
    landingPage.clickFilterMessagesButton(mockSingleFilterResult);
    landingPage.verifyFilterResults('draft', mockSingleFilterResult);

    cy.get(Locators.DROPDOWN).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
