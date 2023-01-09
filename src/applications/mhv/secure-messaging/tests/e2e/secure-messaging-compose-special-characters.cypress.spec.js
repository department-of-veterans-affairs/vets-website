import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';
// import mockResponse from '../fixtures/recipients.json';
import mockMessages from '../fixtures/messages-response.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';

describe(manifest.appName, () => {
  it('can send message with special characters', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    // cy.get('[data-testid="compose-sidebar"] > a').click();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolder,
    ).as('basicSearchRequestSentMeta');
    // mockMessages.data.at(0).attributes.subject = 'Test With Special Characters';
    // mockMessages.data.at(0).attributes.body = '2343*&^%$#@!)+?*';
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestSentFolder');

    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('BLUE ANCILLARY_TEAM');
    cy.get('[name="TEST_RESULTS"]').click();

    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test With Special Characters');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('2343*&^%$#@!)+?*');
    composePage.sendMessage();

    // cy.get('[data-testid="sent-sidebar"]').click({ force: true });
    cy.get('[data-testid="sent-sidebar"] > a').click({ force: true });

    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('[id="va-search-input"]')
      .type('Test with Special Characters', { waitforanimations: true });
    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('[id="va-search-button-text"]')
      .click();

    // // cy.get('.search-button > .fas').click({ waitForAnimations: true });
    cy.wait('@basicSearchRequestSentFolder');
  });
});
