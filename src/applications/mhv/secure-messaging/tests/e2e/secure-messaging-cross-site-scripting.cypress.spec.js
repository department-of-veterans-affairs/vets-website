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
    cy.axeCheck();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Cross Scripting - ><script>alert(1);</script>');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body- ><script>alert(1);</script>');
    composePage.sendMessage();
    cy.get('@message')
      .its('request.body')
      .should('contain', {
        category: 'COVID',
        body: 'Test message body- >\x3Cscript>alert(1);\x3C/script>',
        subject: 'Test Cross Scripting - >\x3Cscript>alert(1);\x3C/script>',
      });
    cy.contains('Message was successfully sent.');
  });
});
