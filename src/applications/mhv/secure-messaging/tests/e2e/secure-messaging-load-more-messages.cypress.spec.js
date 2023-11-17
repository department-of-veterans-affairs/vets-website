import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import mockThread from './fixtures/thread-response.json';
import mockFirstMessage from './fixtures/first-message-from-thread-response.json';

describe('Secure Messaging Inbox Message Sort', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('load more messages', () => {
    landingPage.loadSingleThread();

    cy.focused().should(
      'contain.text',
      mockFirstMessage.data.attributes.subject,
    );
    cy.get('va-accordion-item')
      .should('have.length', 5)
      .as('quantity-before-expanding');

    cy.contains('more messages').click();

    cy.get('va-accordion-item')
      .should('have.length', 10)
      .as('quantity-after-first-expanding');

    cy.contains('more messages').click();

    cy.get('va-accordion-item')
      .should('have.length', mockThread.data.length)
      .as('quantity-after-last-expanding');

    cy.contains('more messages').should('not.exist');

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
