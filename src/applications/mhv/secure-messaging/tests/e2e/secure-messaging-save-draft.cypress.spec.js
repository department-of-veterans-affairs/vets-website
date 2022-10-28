import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
// import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';
import mockMessages from '../fixtures/messages-response.json';
// import mockDraftResponse from '../fixtures/message-draft-response.json';

beforeEach(() => {
  window.dataLayer = [];
});

describe(manifest.appName, () => {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('can send message', () => {
    const landingPage = new PatientMessagesLandingPage();
    // const composePage = new PatientComposePage();
    landingPage.loadPage(false);
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-2', mockMessages).as(
      'draftsResponse',
    );
    cy.injectAxe();
    cy.axeCheck();
    /*
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/*',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.contains('Test Inquiry').click();
    cy.wait('@draftMessageResponse');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="message-subject-field"]').type('Test Subject');
    cy.get('[data-testid="message-body-field"]').type('message Test');
    composePage.saveDraft();
    */
  });
});
