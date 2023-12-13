import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const composePage = new PatientComposePage();

  it.skip('Check confirmation message after save draft', () => {
    // https://glebbahmutov.com/blog/onbeforeunload/
    Cypress.on('window:before:load', win => {
      Object.defineProperty(win, 'onbeforeunload', {
        value: undefined,
        writable: false,
      });
    });
    site.login();
    inboxPage.loadInboxMessages();

    inboxPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBody.subject}`);
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    composePage.saveDraftByKeyboard();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
    // next line is for checking if assertion works properly

    cy.get('#save-draft-button')
      .should('exist')
      .and('be.focused');

    // cy.get('.last-save-time').should('be.focused');
    // cy.reload();
    // cy.pause();
  });
});
