import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import SeeStaff from '../pages/SeeStaff';

describe('Check In Experience', () => {
  describe('Demographics Update Flags', () => {
    beforeEach(() => {
      const patchSpy = cy.spy().as('demographicsPatchSuccess');
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeDemographicsPatch.withSuccess(patchSpy);
    });

    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff with demographics update', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.called;
      });
    });
    it('see staff with emergency contact update', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('yes');

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.called;
      });
    });
    it('see staff with next of kin update', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

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

      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.called;
      });
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
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
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

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();
    });
  });
});
