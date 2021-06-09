import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('dynamic routing keeps token -- check in -- happy path', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');

    cy.get('.vads-u-margin--3 > :nth-child(3)').click();
    cy.get('h1').contains('Your appointment');
    cy.url().should('contain', token);
    cy.url().should('contain', 'details');

    cy.get('.usa-button').click();
    cy.get('h1').contains('Thank you for checking in');
    cy.url().should('contain', token);
    cy.url().should('contain', 'confirmed');
  });
  it('dynamic routing keeps token -- check in', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');

    cy.get('.vads-u-margin--3 > :nth-child(2)').click();
    cy.get('h1').contains('staff member');
    cy.url().should('contain', token);
    cy.url().should('contain', 'failed');
  });
});
