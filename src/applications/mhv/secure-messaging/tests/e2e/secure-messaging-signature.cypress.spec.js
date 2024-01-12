import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import mockThread from './fixtures/thread-response.json';

describe('verify signature', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const currentDate = new Date().toISOString();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('signature added on composing', () => {
    landingPage.navigateToComposePage();
    landingPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('signature added on replying', () => {
    landingPage.loadSingleThread(mockThread, currentDate);
    landingPage.replyToMessage();
    landingPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
