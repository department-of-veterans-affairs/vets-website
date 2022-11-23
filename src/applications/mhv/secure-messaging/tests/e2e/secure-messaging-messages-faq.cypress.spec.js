import manifest from '../../manifest.json';
// import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Messages FAQ', () => {
    // const landingPage = new PatientMessagesLandingPage();
    // landingPage.loadPage();
    // /my-health/secure-messages/faq
    cy.visit('/my-health/secure-messages/faq');
    cy.get('[data-testid="messages-faq-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
