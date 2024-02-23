import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage
      .getMessageSubjectField()
      .type(`${requestBody.subject}`, { force: true });
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    composePage.sendMessage(requestBody);
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
