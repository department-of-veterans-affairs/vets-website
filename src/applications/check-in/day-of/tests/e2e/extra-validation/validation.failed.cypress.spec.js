import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeCheckInDataGet.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Second Attempt
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();
      cy.createScreenshots('Day-of-check-in--inline-validation-error');
    });
    it('fails validation once and then succeeds on the second attempt', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Second Attempt
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
  });
});
