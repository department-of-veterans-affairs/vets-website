import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockInboxNoMessages from './fixtures/empty-thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Inbox No Messages', () => {
  it('inbox no messages', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();

    site.login();
    landingPage.loadInboxMessages(mockInboxNoMessages);

    cy.get('@inboxMessages')
      .its('response')
      .should('have.property', 'statusCode', 200);

    cy.get('[data-testid=alert-no-messages] p')
      .should('have.text', 'There are no messages in this folder.')
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
