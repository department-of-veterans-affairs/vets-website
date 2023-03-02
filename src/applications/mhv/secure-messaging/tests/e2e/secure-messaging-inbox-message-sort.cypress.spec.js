import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Inbox Message Sort', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('.sidebar-navigation-messages-list-header > a');
  });
  it('Sort Inbox Messages from Newest to Oldest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Newest');
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('asc', { force: true })
      .should('contain', 'newest');
  });
  it('Sort Inbox Messages from A to Z', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('sender-alpha-asc', { force: true })
      .should('contain', 'A to Z');
  });

  it('Sort Inbox Messages from Z to A', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('sender-alpha-desc', { force: true })
      .should('contain', 'Z to A');
  });

  afterEach(() => {
    cy.get('[data-testid="sort-button"]').click({ force: true });
    cy.injectAxe();
    cy.axeCheck();
  });
});
