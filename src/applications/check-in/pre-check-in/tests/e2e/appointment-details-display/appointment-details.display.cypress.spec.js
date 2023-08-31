import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre-Check In Experience', () => {
  describe('Appointment details in person', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess();

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment details page content loads for in person appointment with address', () => {
      Confirmation.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateSubtitleInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere();
      AppointmentDetails.validateFacilityAddress(true);
      AppointmentDetails.validateDirectionsLink(true);
      AppointmentDetails.validatePhone();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Pre-check-in--Appointment-detail--in-person');
    });
  });

  describe('Appointment details in person no facility address', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess({
        uuid: '5d5a26cd-fb0b-4c5b-931e-2957bfc4b9d3',
      });

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment details displays without address when no address is present', () => {
      Confirmation.clickDetails();
      AppointmentDetails.validateFacilityAddress(false);
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Pre-check-in--Appointment-detail--in-person--no-facility-address',
      );
    });
  });

  describe('Appointment details in phone', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess({
        uuid: '258d753c-262a-4ab2-b618-64b645884daf',
      });

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID('258d753c-262a-4ab2-b618-64b645884daf');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment details page content loads for phone appointment', () => {
      Confirmation.clickDetails();
      AppointmentDetails.validatePageLoadedPhone();
      AppointmentDetails.validateSubtitlePhone();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateNeedToMakeChanges();
      AppointmentDetails.validatePhone();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Pre-check-in--Phone-appointment--Appointment-detail',
      );
    });
  });
});
