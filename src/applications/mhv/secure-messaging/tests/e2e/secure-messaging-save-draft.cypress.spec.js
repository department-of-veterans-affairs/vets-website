import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';

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
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-select"]')
      .shadow()
      .find('[id="select"]')
      .select('BLUE ANCILLARY_TEAM');
    cy.get('[id="category-COVID"]').click();
    cy.get('[data-testid="message-subject-field"]').type('Test Subject');
    cy.get('[data-testid="message-body-field"]').type('message Test');
    composePage.saveDraft();
  });
});
