import features from '../mocks/enabled.json';
import mockCheckIn from '../../../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply({
        statusCode: 200,
        body: mockValidate.createMockFailedResponse({}),
        delay: 10, // milliseconds
      });
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });

    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('token is not valid', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=MALFORMED_TOKEN';
    cy.visit(featureRoute);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
