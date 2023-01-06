import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';
// import mockResponse from '../fixtures/recipients.json';
import mockMessages from '../fixtures/messages-response.json';

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
      .type('Test message with special characters - 2343*&^%$#@!)+?*');
    composePage.sendMessage();
    //  cy.get('[data-testid="compose-message-link"]').click({ waitForAnimations: true });

    // cy.intercept(
    //     'GET',
    //     'my_health/v1/messaging/recipients?useCache=false',
    //     mockResponse,);
    // //cy.wait('@mockResponse');
    // cy.get('.vads-u-margin-y--0')
    //     .should('have.text', 'Message was successfully sent.');
    cy.get('#select-search-folder-dropdown')
      .shadow()
      .find('select')
      .select('-1', { force: true });
    cy.get('[data-testid="search-keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('Test');
    cy.intercept('GET', '/my_health/v1/messaging/folders/-1', mockMessages).as(
      'sentResponse',
    );

    cy.get('.search-button > .fas').click({ waitForAnimations: true });

    // cy.get('[data-testid="sent-sidebar"]').click({ force: true });
    // cy.get('[data-testid="Sent messages"]')
    //     .should('contain', 'Sent')
  });
});
