import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Compose Categories', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    PatientInboxPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category General', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('General');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Covid', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('COVID');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Appointment', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('Appointment');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('can send message for category Medication', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('Medication');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('can send message for category Test', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('Test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('can send message for category Education', () => {
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.enterComposeMessageDetails('Education');
    cy.injectAxe();
    cy.axeCheck();
  });
  afterEach(() => {
    PatientComposePage.sendMessage();
    PatientInboxPage.verifySentSuccessMessage();
  });
});
