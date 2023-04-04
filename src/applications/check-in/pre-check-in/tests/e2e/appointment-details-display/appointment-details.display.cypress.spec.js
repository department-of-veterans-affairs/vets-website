import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';

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
      Introduction.validatePageLoaded();
      Introduction.attemptToGoToNextPage();
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
    it('Appointment details page content loads for in person appointment', () => {
      Confirmation.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateSubtitleInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateWhat();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere();
      AppointmentDetails.validatePhone();
      cy.injectAxeThenAxeCheck();
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
      Introduction.validatePageLoaded();
      Introduction.attemptToGoToNextPage();
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
      AppointmentDetails.validateWhat();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere('phone');
      AppointmentDetails.validatePhone();
      cy.injectAxeThenAxeCheck();
    });
  });
});
