import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('check-in with demographics confirmation', () => {
    const appointments = [
      { startTime: '2021-08-19T03:00:00' },
      { startTime: '2021-08-19T03:30:00' },
      { startTime: '2021-08-19T04:30:00' },
    ];
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();

      const demographicsPatchSpy = cy.spy().as('demographicsPatchSpy');
      cy.intercept(
        {
          method: 'PATCH',
          url: `/check_in/v2/demographics/*`,
          middleware: true,
        },
        () => {
          demographicsPatchSpy();
        },
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('happy path with confirmed demographics', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();


      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();

      Appointments.attemptCheckIn(1);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      cy.get('@demographicsPatchSpy').then(spy => {
        expect(spy).to.be.calledOnce;
      });

      cy.wait('@demographicsPatchSuccessAlias');
      cy.get('@demographicsPatchSuccessAlias')
        .its(
          'request.body.demographics.demographicConfirmations.demographicsUpToDate',
        )
        .should('equal', true);
      cy.get('@demographicsPatchSuccessAlias')
        .its(
          'request.body.demographics.demographicConfirmations.emergencyContactUpToDate',
        )
        .should('equal', true);
      cy.get('@demographicsPatchSuccessAlias')
        .its(
          'request.body.demographics.demographicConfirmations.nextOfKinUpToDate',
        )
        .should('equal', true);
      cy.get('@demographicsPatchSuccessAlias')
        .its('response.statusCode')
        .should('equal', 200);

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(3);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      // call should not occur a second time if first call was successful
      cy.get('@demographicsPatchSpy').then(spy => {
        expect(spy).to.be.calledOnce;
      });
    });
  });
  describe('check-in demographics confirmation - With API error', () => {
    const appointments = [
      { startTime: '2021-08-19T03:00:00' },
      { startTime: '2021-08-19T03:30:00' },
      { startTime: '2021-08-19T04:30:00' },
    ];
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      // Response delayed by 5 seconds.
      initializeDemographicsPatch.withFailure(400, 5000);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('check-in confirmation with demographics API error', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();


      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();

      cy.wait('@demographicsPatchFailureAlias');
      cy.get('@demographicsPatchFailureAlias')
        .its('response.statusCode')
        .should('equal', 400);

      Appointments.attemptCheckIn(1);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('All confirmation pages skipped', () => {
    const appointments = [
      { startTime: '2021-08-19T03:00:00' },
      { startTime: '2021-08-19T03:30:00' },
      { startTime: '2021-08-19T04:30:00' },
    ];
    beforeEach(() => {
      const now = Date.now();
      const today = new Date(now);
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: today.toISOString(),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: today.toISOString(),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: today.toISOString(),
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();

      const demographicsPatchSpy = cy.spy().as('demographicsPatchSpy');
      cy.intercept(
        {
          method: 'PATCH',
          url: `/check_in/v2/demographics/*`,
          middleware: true,
        },
        () => {
          demographicsPatchSpy();
        },
      );

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Do not send demographics confirmations if all confirm pages skipped', () => {
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);

      cy.injectAxeThenAxeCheck();
      Confirmation.validatePageLoaded();

      // call should not occur if all confirmation pages skipped
      cy.get('@demographicsPatchSpy').then(spy => {
        expect(spy).not.to.be.called;
      });
    });
  });
});
