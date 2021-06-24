import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockFailedResponse({}));
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
