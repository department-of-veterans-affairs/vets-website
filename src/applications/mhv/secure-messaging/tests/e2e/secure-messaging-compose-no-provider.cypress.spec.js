import PatientInboxPage from './pages/PatientInboxPage';

import manifest from '../../manifest.json';
import mockDraftMessage from '../fixtures/message-draft-response.json';

describe(manifest.appName, () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();

    landingPage.login();
    landingPage.loadPageForNoProvider();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('');
    cy.get('[name="COVID"]').click();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Subject');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="error-message"]')
      .should('contain', ' Please select a recipient.');
  });
});
