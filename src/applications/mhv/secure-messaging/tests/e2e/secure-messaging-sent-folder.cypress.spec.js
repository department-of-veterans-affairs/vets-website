import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Axe Check Sent Folder', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    mockMessages.data.at;
    cy.intercept('GET', '/my_health/v1/messaging/folders/-1', mockMessages).as(
      'sentResponse',
    );
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
