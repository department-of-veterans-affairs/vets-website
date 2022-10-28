import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from '../fixtures/messages-response.json';

beforeEach(() => {});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('is test fine accessible', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.loadPage();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-3', mockMessages).as(
      'trashFolder',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/messages',
      mockMessages,
    ).as('trashFolderMessages');
    cy.get('[data-testid="trash-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
