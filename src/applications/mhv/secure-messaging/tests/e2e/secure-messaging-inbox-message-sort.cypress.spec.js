import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Inbox Message Sort', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    cy.reload(true);
    PatientInboxPage.loadInboxMessages();
    cy.get('.sidebar-navigation-messages-list-header > a');
  });
  it('Sort Inbox Messages from Newest to Oldest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Newest');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('ASC', { force: true })
      .should('contain', 'newest');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Sort Inbox Messages from A to Z', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('sender-alpha-asc', { force: true })
      .should('contain', 'A to Z');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Z to A', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('sender-alpha-desc', { force: true })
      .should('contain', 'Z to A');
    cy.injectAxe();
    cy.axeCheck();
  });

  afterEach(() => {
    cy.get('[data-testid="sort-button"]').click({ force: true });
  });
});
