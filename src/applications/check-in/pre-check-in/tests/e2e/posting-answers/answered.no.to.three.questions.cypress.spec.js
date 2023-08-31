import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
      initializePreCheckInDataPost,
      initializeDemographicsPatch,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeDemographicsPatch.withSuccess();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataGet.withSuccess();

    initializePreCheckInDataPost.withSuccess(req => {
      expect(req.body.preCheckIn.uuid).to.equal(
        '46bebc0a-b99c-464f-a5c5-560bc9eae287',
      );
      expect(req.body.preCheckIn.demographicsUpToDate).to.equal(false);
      expect(req.body.preCheckIn.nextOfKinUpToDate).to.equal(false);
      expect(req.body.preCheckIn.emergencyContactUpToDate).to.equal(false);
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
    ValidateVeteran.validatePage.preCheckIn();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validateVeteran();

    ValidateVeteran.attemptToGoToNextPage();

    // page: Appointments
    AppointmentsPage.validatePageLoaded();
    AppointmentsPage.attemptPreCheckIn();

    // page: Demographics
    Demographics.validatePageLoaded();
    cy.injectAxeThenAxeCheck();

    Demographics.attemptToGoToNextPage('no');

    // page: Emergency Contact
    EmergencyContact.validatePageLoaded();
    cy.injectAxeThenAxeCheck();

    EmergencyContact.attemptToGoToNextPage('no');

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    cy.injectAxeThenAxeCheck();

    NextOfKin.attemptToGoToNextPage('no');

    // page: Confirmation
    Confirmation.validatePageLoaded();
    cy.createScreenshots('Pre-check-in--confirmation-answer-no-to-all');
    cy.injectAxeThenAxeCheck();
  });
});
