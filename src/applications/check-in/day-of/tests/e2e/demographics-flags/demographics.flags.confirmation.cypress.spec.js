import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  describe('check-in with demographics confirmation', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 2,
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

      Appointments.attemptCheckIn(2);
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
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 2,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withFailure(400);
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

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      cy.wait('@demographicsPatchFailureAlias');
      cy.get('@demographicsPatchFailureAlias')
        .its('response.statusCode')
        .should('equal', 400);

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(3);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      cy.wait('@demographicsPatchFailureAlias');
      cy.get('@demographicsPatchFailureAlias')
        .its('response.statusCode')
        .should('equal', 400);
    });
  });
  describe('All confirmation pages skipped', () => {
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
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 2,
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
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Do not send demographics confirmations if all confirm pages skipped', () => {
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(2);

      cy.injectAxeThenAxeCheck();
      Confirmation.validatePageLoaded();

      // call should not occur if all confirmation pages skipped
      cy.get('@demographicsPatchSpy').then(spy => {
        expect(spy).not.to.be.called;
      });
    });
  });
});
