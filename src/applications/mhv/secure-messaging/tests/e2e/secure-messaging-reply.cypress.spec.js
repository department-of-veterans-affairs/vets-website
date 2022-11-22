import manifest from '../../manifest.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesLandingPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    landingPage.loadPage();
    landingPage.loadMessageDetails('Test Inquiry');
    messageDetailsPage.loadReplyPage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
