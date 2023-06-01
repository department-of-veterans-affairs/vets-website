import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging - Cross Site Scripting', () => {
  it('search for script', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck();
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    PatientComposePage.getMessageSubjectField().type(
      'Test Cross Scripting - ><script>alert(1);</script>',
    );
    PatientComposePage.getMessageBodyField().type(
      'Test message body- ><script>alert(1);</script>',
    );
    PatientComposePage.sendMessage();
    cy.get('@message')
      .its('request.body')
      .should('contain', {
        category: 'COVID',
        body: 'Test message body- >\x3Cscript>alert(1);\x3C/script>',
        subject: 'Test Cross Scripting - >\x3Cscript>alert(1);\x3C/script>',
      });
    PatientComposePage.verifySendMessageConfirmationMessage();
  });
});
