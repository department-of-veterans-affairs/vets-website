import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging - Print Functionality', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const messageDetailsPage = new PatientMessageDetailsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      landingPage.getNewMessageDetails(),
    );
    messageDetailsPage.loadMessageDetails(
      landingPage.getNewMessageDetails(),
      defaultMockThread,
      0,
    );
  });

  it('print messages', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
    cy.get(Locators.BUTTONS.PRINT).should('be.visible');
    cy.get(Locators.BUTTONS.PRINT).click();
    cy.window().then(win => {
      cy.get(Locators.BUTTONS.PRINT).should('be.visible');
      expect(win.print).to.be.calledOnce;
    });
  });
});
