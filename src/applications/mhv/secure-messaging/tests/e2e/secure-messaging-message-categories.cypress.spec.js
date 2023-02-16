import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Compose', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();
  beforeEach(() => {
    site.login();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    landingPage.loadPage(false);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category General', () => {
    cy.get('[data-testid="compose-message-link"]').click();
    composePage.enterComposeMessageDetails('General');
  });

  it('can send message for category Covid', () => {
    cy.get('[data-testid="compose-message-link"]').click({
      waitforanimations: true,
    });
    composePage.enterComposeMessageDetails('COVID');
  });

  it('can send message for category Appointment', () => {
    cy.get('[data-testid="compose-message-link"]').click({
      waitforanimations: true,
    });
    composePage.enterComposeMessageDetails('Appointment');
  });
  it('can send message for category Medication', () => {
    cy.get('[data-testid="compose-message-link"]').click({
      waitforanimations: true,
    });
    composePage.enterComposeMessageDetails('Medication');
  });
  it('can send message for category Test', () => {
    cy.get('[data-testid="compose-message-link"]').click({
      waitforanimations: true,
    });
    composePage.enterComposeMessageDetails('Test');
  });

  it('can send message for category Education', () => {
    cy.get('[data-testid="compose-message-link"]').click({
      waitforanimations: true,
    });
    composePage.enterComposeMessageDetails('Education');
  });
  afterEach(() => {
    composePage.sendMessage();
    landingPage.verifySentSuccessMessage();
  });
});
