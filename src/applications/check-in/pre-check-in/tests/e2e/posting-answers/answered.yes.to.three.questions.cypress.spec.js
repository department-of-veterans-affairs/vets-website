import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import confirmation from '../pages/Confirmation';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  let apiData = {};
  beforeEach(function() {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        emergencyContactEnabled: true,
      }),
    );
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();

    apiInitializer.initializeSessionPost.withSuccess();

    apiData = apiInitializer.initializePreCheckInDataGet.withSuccess();

    apiInitializer.initializePreCheckInDataPost.withSuccess(req => {
      expect(req.body.preCheckIn.uuid).to.equal(
        '0429dda5-4165-46be-9ed1-1e652a8dfd83',
      );
      expect(req.body.preCheckIn.demographicsUpToDate).to.equal(true);
      expect(req.body.preCheckIn.nextOfKinUpToDate).to.equal(true);
      expect(req.body.preCheckIn.emergencyContactUpToDate).to.equal(true);
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Answered yes to both questions', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    validateVeteran.validatePageLoaded();
    validateVeteran.validateVeteran();

    validateVeteran.attemptToGoToNextPage();

    // page: Introduction
    introduction.validatePageLoaded();
    introduction.countAppointmentList(apiData.payload.appointments.length);
    introduction.attemptToGoToNextPage();

    // page: Demographics
    Demographics.validatePageLoaded();
    Demographics.attemptToGoToNextPage();

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    NextOfKin.attemptToGoToNextPage();

    // page: Emergency Contact
    EmergencyContact.validatePageLoaded();
    EmergencyContact.attemptToGoToNextPage();

    // page: Confirmation
    confirmation.validatePageLoaded();
  });
});
