import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
  });
  it('feature is enabled', () => {
    const featureRoute = '/check-in/some-token';
    cy.visit(featureRoute);
    cy.get('h1').contains('insurance');
  });
});
