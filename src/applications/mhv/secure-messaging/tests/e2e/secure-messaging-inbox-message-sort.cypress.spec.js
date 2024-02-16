import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Inbox Message Sort', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    cy.reload(true);
    landingPage.loadInboxMessages();
    cy.get('.sidebar-navigation-messages-list-header > a');
  });
  it('Sort Inbox Messages from Newest to Oldest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Newest');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('SENT_DATE_ASCENDING', { force: true })
      .should('contain', 'newest');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
  it('Sort Inbox Messages from A to Z', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('SENDER_ALPHA_ASCENDING', { force: true })
      .should('contain', 'A to Z');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('Sort Inbox Messages from Z to A', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('SENDER_ALPHA_DESCENDING', { force: true })
      .should('contain', 'Z to A');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  afterEach(() => {
    cy.get('[data-testid="sort-button"]').click({ force: true });
  });
});
