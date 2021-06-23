import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply({ id: 'abc-123', appointment: {} });
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply({ success: true });
    });
  });
  it('dynamic routing keeps token -- check in -- happy path', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');

    cy.get('[data-testid="no-button"]').click();
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

    cy.get('[data-testid="yes-button"]').click();
    cy.get('h1').contains('staff member');
    cy.url().should('contain', token);
    cy.url().should('contain', 'failed');
  });
});
