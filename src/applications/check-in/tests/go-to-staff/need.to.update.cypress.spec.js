import features from '../mocks/enabled.json';

describe('Check In Experience -- happy path', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('needs to update information', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance information');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('#errorable-radio-buttons-1-0').click();
    cy.get('.usa-button').click();
    cy.get('.hydrated > h3').contains(
      'Please see a staff member to complete check-in.',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
