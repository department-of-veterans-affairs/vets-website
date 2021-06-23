import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply({ id: 'abc-123', appointment: {} });
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply({ success: false });
    });
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('happy path', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance');
    cy.get('[data-testid="no-button"]').click();
    cy.get('h1').contains('Your appointment');
    cy.get('.usa-button').click();
    cy.get('h1').contains('staff member');
  });
});
