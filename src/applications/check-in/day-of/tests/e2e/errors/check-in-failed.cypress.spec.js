import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.authenticate();
    cy.getSingleAppointment();
    cy.failedCheckin();
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.visitWithUUID();
    ValidateVeteran.validatePageLoaded('Check in at VA');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Demographics.attemptToGoToNextPage();
    NextOfKin.attemptToGoToNextPage();
    Appointments.validatePageLoaded();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5722 - Check in failed with a 200 and error message in the body', () => {
    Appointments.attemptCheckIn(2);
    Error.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
  });
});
