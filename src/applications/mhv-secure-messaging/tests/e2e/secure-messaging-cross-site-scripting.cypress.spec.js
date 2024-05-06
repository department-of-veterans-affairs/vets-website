import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging - Cross Site Scripting', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

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
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(
      `${requestBodyUpdated.subject}`,
    );
    PatientComposePage.getMessageBodyField().type(requestBodyUpdated.body, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBodyUpdated);

    // this assertion already added to composePage.sendMessage method. Check if it still needed
    cy.get(Locators.INFO.MESSAGE)
      .its('request.body')
      .should('contain', {
        category: `${requestBodyUpdated.category}`,
        body:
          '\n\n\nName\nTitleTestTest message body - >\x3Cscript>alert(1);\x3C/script>',
        subject: 'Test Cross Scripting - >\x3Cscript>alert(1);\x3C/script>',
      });
    PatientComposePage.verifySendMessageConfirmationMessageText();
  });
});
