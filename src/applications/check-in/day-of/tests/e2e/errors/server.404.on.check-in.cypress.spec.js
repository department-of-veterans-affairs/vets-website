import mockCheckIn from '../../../api/local-mock-api/mocks/v2/check.in.responses';
import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Error from '../../../../tests/e2e/pages/Error';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.authenticate();
    cy.getSingleAppointment();
    cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
      req.reply(404, mockCheckIn.createMockFailedResponse({}));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visitWithUUID();
    ValidateVeteran.validatePageLoaded('Check in at VA');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Demographics.attemptToGoToNextPage();
    NextOfKin.attemptToGoToNextPage();
    Appointments.validatePageLoaded();
    Appointments.attemptCheckIn(2);
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5730 - Check in - 404 api error', () => {
    Error.validateURL();
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
