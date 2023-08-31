import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import SeeStaff from '../pages/SeeStaff';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('Demographics Update Flags', () => {
    beforeEach(() => {
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
      initializeCheckInDataGet.withSuccess();
      initializeDemographicsPatch.withSuccess();
    });

    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff with demographics update', () => {
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
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

      cy.wait('@demographicsPatchSuccessAlias');
      cy.get('@demographicsPatchSuccessAlias')
        .its(
          'request.body.demographics.demographicConfirmations.demographicsUpToDate',
        )
        .should('equal', false);
      cy.get('@demographicsPatchSuccessAlias')
        .its('response.statusCode')
        .should('equal', 200);
    });
    it('see staff with emergency contact update', () => {
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
      Demographics.attemptToGoToNextPage('yes');

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

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
        .should('equal', false);
      cy.get('@demographicsPatchSuccessAlias')
        .its('response.statusCode')
        .should('equal', 200);
    });
    it('see staff with next of kin update', () => {
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
      Demographics.attemptToGoToNextPage('yes');

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage('yes');

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

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
        .should('equal', false);
      cy.get('@demographicsPatchSuccessAlias')
        .its('response.statusCode')
        .should('equal', 200);
    });
  });
  describe('Demographics Update Flags - With Patch API Error', () => {
    beforeEach(() => {
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
      initializeCheckInDataGet.withSuccess();
      initializeDemographicsPatch.withFailure();
    });

    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff with demographics update - API error', () => {
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
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

      cy.wait('@demographicsPatchFailureAlias');
      cy.get('@demographicsPatchFailureAlias')
        .its(
          'request.body.demographics.demographicConfirmations.demographicsUpToDate',
        )
        .should('equal', false);
      cy.get('@demographicsPatchFailureAlias')
        .its('response.statusCode')
        .should('equal', 400);
    });
  });
});
