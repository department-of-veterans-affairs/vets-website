import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';

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
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('can send message for category Medication-MEDICATIONS', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('MEDICATIONSMEDICATIONSinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('can send message for category General-OTHER', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('OTHEROTHERinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('can send message for category Test-TEST_RESULTS', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('TEST_RESULTSTEST_RESULTSinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  afterEach(() => {
    composePage.sendMessage();
    landingPage.verifySentSuccessMessage();
  });
});
