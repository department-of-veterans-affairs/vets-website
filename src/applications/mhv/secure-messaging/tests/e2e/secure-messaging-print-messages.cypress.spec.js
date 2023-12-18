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
    cy.get(Locators.BUTTONS.PRINT)
      .should('be.visible')
      .click({ force: true });

    cy.get('[data-testid="print-modal-popup"]')
      .find('h1')
      .should('have.text', 'Make sure you have all messages expanded');

    cy.window().then(win => {
      win.print();
      expect(win.print).to.be.calledOnce;
      cy.get('va-button[secondary]').click({ force: true });
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
    });
  });
});
