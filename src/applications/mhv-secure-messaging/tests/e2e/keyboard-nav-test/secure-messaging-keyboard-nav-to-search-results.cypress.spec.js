import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';

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

  it('Verify filter works correctly and highlight the filter text', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.inputFilterData('test');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.verifyFilterResults('test', mockFilterResults);
    landingPage.verifyFilterTextHighLightedInSearch();
  });

  it('Verify filter have no result', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.inputFilterData('Functions');
    landingPage.clickFilterMessagesButton(mockFilterResults);
    landingPage.verifyNoMatchFilterFocusAndText();
  });
});
