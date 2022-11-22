import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
