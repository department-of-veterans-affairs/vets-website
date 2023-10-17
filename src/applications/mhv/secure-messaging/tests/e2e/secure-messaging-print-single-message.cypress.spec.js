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
    cy.get('[data-testid="radio-print-one-message"]')
      .find('label')
      .should('have.text', 'Print only this message');
    cy.get('[data-testid="radio-print-all-messages"]')
      .find('label')
      .should('contain.text', 'Print all messages in this conversation');
    cy.get('[data-testid="print-modal-popup"]')
      .find('h1')
      .should('have.text', 'What do you want to print?');
    cy.get('[data-testid="radio-print-all-messages"]').click({ force: true });
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
  it('print single message', () => {
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
