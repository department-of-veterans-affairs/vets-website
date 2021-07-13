import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- happy path', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
  });
  it('needs to update information', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.get('h1').contains('insurance');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="yes-button"]').click();
    cy.get('h1').contains('staff member');
    cy.injectAxe();
    cy.axeCheck();
  });
});
