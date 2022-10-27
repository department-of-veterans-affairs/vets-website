import manifest from '../../manifest.json';
import mockMessage from './fixtures/message-response.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {});

describe(manifest.appName, function() {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('is test fine accessible', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    cy.intercept('GET', '/my_health/v1/messaging/messages/*', mockMessage).as(
      'message',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/*/thread',
      mockMessage,
    ).as('message');
    cy.contains('Test Inquiry').click();
    cy.wait('@message');
  });
});
