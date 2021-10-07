import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockCheckIn from '../../../../api/local-mock-api/mocks/v0/check.in.responses';
import mockValidate from '../../../../api/local-mock-api/mocks/v0/validate.responses';

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

    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceLowAuthenticationEnabled: false,
        checkInExperienceMultipleAppointmentSupport: false,
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5724 - Token is not valid', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=MALFORMED_TOKEN';
    cy.visit(featureRoute);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
