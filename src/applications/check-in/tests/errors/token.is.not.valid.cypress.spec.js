import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply({ id: 'abc-123' });
    });

    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('token is not valid', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('staff member');
  });
});
