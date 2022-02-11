import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Error from '../pages/Error';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
    initializeCheckInDataGet.withSuccess({
      numberOfCheckInAbledAppointments: 1,
    });
    initializeCheckInDataPost.withFailure(404);

    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visitWithUUID();
    ValidateVeteran.validatePage.dayOf();
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Demographics.attemptToGoToNextPage();
    NextOfKin.attemptToGoToNextPage();
    EmergencyContact.attemptToGoToNextPage();
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
