import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('happy path', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.vads-u-margin--3 > :nth-child(3)').click();
    cy.get('h1').contains('Your appointment');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    cy.get('h1').contains('Thank you for checking in');
    cy.injectAxe();
    cy.axeCheck();
  });
});
