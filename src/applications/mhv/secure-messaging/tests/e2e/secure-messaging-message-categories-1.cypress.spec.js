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
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Appointment-APPOINTMENTS', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('APPOINTMENTSAPPOINTMENTSinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Covid-COVID', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('COVIDCOVIDinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Education-EDUCATION', () => {
    landingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory('EDUCATIONEDUCATIONinput');
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  afterEach(() => {
    composePage.sendMessage();
    landingPage.verifySentSuccessMessage();
  });
});
