import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Compose Categories', () => {
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
    landingPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category General', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('General');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Covid', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('COVID');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Appointment', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('Appointment');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('can send message for category Medication', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('Medication');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('can send message for category Test', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('Test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Education', () => {
    landingPage.loadComposeMessagePage();
    composePage.enterComposeMessageDetails('Education');
    cy.injectAxe();
    cy.axeCheck();
  });
  afterEach(() => {
    composePage.sendMessage();
    landingPage.verifySentSuccessMessage();
  });
});
