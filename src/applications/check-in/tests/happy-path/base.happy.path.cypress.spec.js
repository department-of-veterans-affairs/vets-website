import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('happy path', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance information');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('#errorable-radio-buttons-1-1').click();
    cy.get('.usa-button').click();
    cy.get('h1').contains('Appointment details');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    cy.get('h1').contains("You're now checked in");
    cy.injectAxe();
    cy.axeCheck();
  });
});
