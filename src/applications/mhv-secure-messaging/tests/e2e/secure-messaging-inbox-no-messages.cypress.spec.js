import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockInboxNoMessages from './fixtures/empty-thread-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Inbox No Messages', () => {
  it('inbox no messages', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockInboxNoMessages);

    cy.get('@inboxMessages')
      .its('response')
      .should('have.property', 'statusCode', 200);

    cy.get(Locators.NO_MESS)
      .should('contain', Data.NO_MSG_IN_FOLDER)
      .should('be.visible');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
