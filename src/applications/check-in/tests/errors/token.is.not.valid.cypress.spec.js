import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockFailedResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });

    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('token is not valid', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('staff member');
  });
});
