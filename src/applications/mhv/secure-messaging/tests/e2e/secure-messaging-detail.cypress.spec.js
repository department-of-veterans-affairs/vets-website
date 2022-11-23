import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    landingPage.loadMessageDetails('Test Inquiry');
    cy.injectAxe();
    cy.axeCheck();
  });
});
