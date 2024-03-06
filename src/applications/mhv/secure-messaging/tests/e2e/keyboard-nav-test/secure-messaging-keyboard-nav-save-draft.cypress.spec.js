import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const composePage = new PatientComposePage();

  it('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();

    inboxPage.navigateToComposePage(true);
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click({ force: true });
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
