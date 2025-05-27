import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging - Cross Site Scripting', () => {
  it('search for script', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.interceptSentFolder();

    const requestBodyUpdated = {
      ...requestBody,
      subject: 'Test Cross Scripting - ><script>alert(1);</script>',
      body: 'Test message body - ><script>alert(1);</script>',
    };
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(
      `${requestBodyUpdated.subject}`,
    );
    PatientComposePage.getMessageBodyField().type(requestBodyUpdated.body, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBodyUpdated);
    PatientComposePage.verifySendMessageConfirmationMessageText();
  });
});
