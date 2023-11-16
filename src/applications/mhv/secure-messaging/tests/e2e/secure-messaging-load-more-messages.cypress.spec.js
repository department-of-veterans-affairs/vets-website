import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockMessages from './fixtures/messages-response.json';
import mockFolders from './fixtures/folder-response.json';
import mockThread from './fixtures/thread-response.json';
import mockFirstMessage from './fixtures/first-message-from-thread-response.json';

describe('Secure Messaging Inbox Message Sort', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
  });
  it('load more messages', () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockMessages.data[0].attributes.messageId
      }/thread`,
      mockThread,
    ).as('full-thread');
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${mockThread.data[0].attributes.messageId}`,
      mockFirstMessage,
    ).as('fist-message-in-thread');

    cy.contains(mockMessages.data[0].attributes.subject).click();

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
