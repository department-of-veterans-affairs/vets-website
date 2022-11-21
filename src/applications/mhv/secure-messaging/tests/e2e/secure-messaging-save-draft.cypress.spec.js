import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

beforeEach(() => {
  window.dataLayer = [];
});

describe(manifest.appName, () => {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('can send message', () => {
    const landingPage = new PatientMessagesLandingPage();
    const composePage = new PatientComposePage();
    landingPage.loadPage(false);
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages*',
      mockDraftMessages,
    ).as('draftsResponse');
    cy.injectAxe();
    cy.axeCheck();
    cy.wait('@draftsResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.contains('test').click();
    cy.wait('@draftMessageResponse');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="message-subject-field"]').type('Test Subject');
    cy.get('[data-testid="message-body-field"]').type('message Test');
    composePage.saveDraft();
  });
});
