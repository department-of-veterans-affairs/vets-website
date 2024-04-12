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
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    landingPage.inputFilterDataText('test');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.verifyFilterResultsText('test', mockFilterResults);
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.inputFilterDataText('test');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.clickClearFilterButton();
    landingPage.verifyFilterFieldCleared();
  });

  it('Check sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    landingPage.verifySorting();
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    landingPage.inputFilterDataText('draft');
    landingPage.clickFilterMessagesButton(mockSingleFilterResult);
    landingPage.verifyFilterResultsText('draft', mockSingleFilterResult);

    cy.get(Locators.DROPDOWN).should('not.exist');
  });
});
