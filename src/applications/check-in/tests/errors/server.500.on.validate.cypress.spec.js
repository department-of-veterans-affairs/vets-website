import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(500, mockValidate.createMockFailedResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockFailedResponse({}));
    });
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5736 - Validate - 500 api error', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.url().should('match', /error/);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
