import manifest from '../../manifest.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    landingPage.login();
    landingPage.loadPage();
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
    cy.get('.message-list-sort > va-button.hydrated').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
