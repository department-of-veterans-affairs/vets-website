import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('is test fine accessible', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
