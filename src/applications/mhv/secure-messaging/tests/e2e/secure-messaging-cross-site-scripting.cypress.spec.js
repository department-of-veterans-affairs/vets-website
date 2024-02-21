import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging - Cross Site Scripting', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('search for script', () => {
    site.login();
    landingPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});

    const requestBodyUpdated = {
      ...requestBody,
      subject: 'Test Cross Scripting - ><script>alert(1);</script>',
      body: 'Test message body - ><script>alert(1);</script>',
    };
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBodyUpdated.subject}`);
    composePage
      .getMessageBodyField()
      .type(requestBodyUpdated.body, { force: true });
    composePage.sendMessage(requestBodyUpdated);

    // this assertion already added to composePage.sendMessage method. Check if it still needed
    cy.get('@message')
      .its('request.body')
      .should('contain', {
        category: `${requestBodyUpdated.category}`,
        body:
          '\n\n\nName\nTitleTestTest message body - >\x3Cscript>alert(1);\x3C/script>',
        subject: 'Test Cross Scripting - >\x3Cscript>alert(1);\x3C/script>',
      });
    composePage.verifySendMessageConfirmationMessageText();
  });
});
