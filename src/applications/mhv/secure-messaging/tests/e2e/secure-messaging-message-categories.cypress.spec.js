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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category General', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('General');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Covid', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('COVID');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Appointment', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('Appointment');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('can send message for category Medication', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('Medication');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('can send message for category Test', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('Test');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('can send message for category Education', () => {
    landingPage.navigateToComposePage();
    composePage.enterComposeMessageDetails('Education');
    cy.injectAxe();
    cy.axeCheck('main', {
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
