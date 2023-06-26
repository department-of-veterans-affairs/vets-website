import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging - Cross Site Scripting', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('search for script', () => {
    site.login();
    landingPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.navigateToComposePage();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    composePage
      .getMessageSubjectField()
      .type('Test Cross Scripting - ><script>alert(1);</script>');
    composePage
      .getMessageBodyField()
      .type('Test message body- ><script>alert(1);</script>');
    composePage.sendMessage();
    cy.get('@message')
      .its('request.body')
      .should('contain', {
        category: 'COVID',
        body: 'Test message body- >\x3Cscript>alert(1);\x3C/script>',
        subject: 'Test Cross Scripting - >\x3Cscript>alert(1);\x3C/script>',
      });
    composePage.verifySendMessageConfirmationMessage();
  });
});
