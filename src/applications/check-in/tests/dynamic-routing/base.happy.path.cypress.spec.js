import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('dynamic routing keeps token -- check in', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance information');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');
    cy.get('#errorable-radio-buttons-1-1').click();
    cy.get('.usa-button').click();

    cy.get('h1').contains('Appointment details');
    cy.url().should('contain', token);
    cy.url().should('contain', 'details');
    cy.get('.usa-button').click();
    cy.get('h1').contains("You're now checked in");
    cy.url().should('contain', token);
    cy.url().should('contain', 'confirmed');
  });
  it('dynamic routing keeps token -- check in', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance information');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');
    cy.get('#errorable-radio-buttons-1-0').click();
    cy.get('.usa-button').click();
    cy.get('.hydrated > h3').contains(
      'Please see a staff member to complete check-in.',
    );
    cy.url().should('contain', token);
    cy.url().should('contain', 'failed');
  });
});
