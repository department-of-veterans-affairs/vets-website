import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockCheckIn from '../../../../api/local-mock-api/mocks/v0/check.in.responses';
import mockValidate from '../../../../api/local-mock-api/mocks/v0/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(403, mockValidate.createMockFailedResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(200, mockCheckIn.createMockSuccessResponse({}));
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
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5728 - Check in - 404 api error', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);

    cy.url().should('match', /error/);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
