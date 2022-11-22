import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {
  window.dataLayer = [];
});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Manage Folders', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
