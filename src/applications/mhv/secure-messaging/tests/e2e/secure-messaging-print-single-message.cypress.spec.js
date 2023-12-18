import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

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

  it('print all messages', () => {
    cy.get('[data-testid="print-button"]')
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
  // TODO the concept of printing has changed, this test needs to be updated once the final design is implemented
  // TODO check with UCD team if the popup should be the same for both scenarios
  it.skip('print single message', () => {
    cy.get('[data-testid="print-button"]').click({ force: true });
    cy.get('[data-testid="print-modal-popup"]')
      .shadow()
      .find('h1')
      .should('have.text', 'What do you want to print?')
      .should('be.visible');
    cy.get('[data-testid="radio-print-one-message"]').click({ force: true });
    cy.window().then(win => {
      win.print();

      expect(win.print).to.be.calledOnce;
    });
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
