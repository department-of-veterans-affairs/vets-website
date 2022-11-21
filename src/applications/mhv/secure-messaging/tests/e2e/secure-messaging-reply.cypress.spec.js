import manifest from '../../manifest.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

beforeEach(() => {});

describe(manifest.appName, function() {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('is test fine accessible', () => {
    const landingPage = new PatientMessagesLandingPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    landingPage.loadPage();
    landingPage.loadMessageDetails('Test Inquiry');
    messageDetailsPage.loadReplyPage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
