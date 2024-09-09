import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Inbox Folder checks', () => {
  const {
    data: [, secondElement, thirdElement],
    ...rest
  } = mockMessages;

  const mockFilterResults = { data: [secondElement, thirdElement], ...rest };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
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
    PatientInboxPage.inputFilterData('test');
    PatientInboxPage.clickFilterMessagesButton(mockFilterResults);
    PatientInboxPage.verifyFilterResults('test', mockFilterResults);
    PatientInboxPage.verifyFilterTextHighLightedInSearch();
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
    PatientInboxPage.inputFilterData('Functions');
    PatientInboxPage.clickFilterMessagesButton(mockFilterResults);
    PatientInboxPage.verifyNoMatchFilterFocusAndText();
  });
});
