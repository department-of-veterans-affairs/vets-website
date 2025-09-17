import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

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
    // Dynamically select first available recipient; then capture actual value for payload assertion
    PatientComposePage.selectRecipient();
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .invoke('val')
      .then(val => {
        // Update expected request body with the real recipientid
        // eslint-disable-next-line camelcase
        requestBodyUpdated.recipient_id = Number(val);
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
});
