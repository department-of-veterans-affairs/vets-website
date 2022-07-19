import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';

describe('Check In Experience', () => {
  describe('Appointment display', () => {
    beforeEach(() => {
      const appointments = [
        {
          eligibility: 'INELIGIBLE_TOO_EARLY',
          startTime: '2021-08-19T12:00:00',
          checkInWindowStart: '2021-08-19T11:00:00',
        },
        {
          eligibility: 'INELIGIBLE_TOO_EARLY',
          startTime: '2021-08-19T14:00:00',
          checkInWindowStart: undefined,
        },
      ];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({ appointments });

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment shows early status with time and without', () => {
      Appointments.validateEarlyStatusWithoutTime();
      Appointments.validateEarlyStatusWithTime();
      cy.injectAxeThenAxeCheck();
    });
  });
});
