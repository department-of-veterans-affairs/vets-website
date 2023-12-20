import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';
import Confirmation from './pages/Confirmation';
import Demographics from '../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';

describe('Check In Experience | Day Of | API Errors', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializeCheckInDataGet,
    initializeCheckInDataPost,
    initializeDemographicsPatch,
    initializeBtsssPost,
  } = ApiInitializer;
  beforeEach(() => {
    initializeFeatureToggle.withCurrentFeatures();
  });
  describe('fail at session GET', () => {
    it('attempt to sign in with an error', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withFailure(200);
      cy.visitWithUUID();
      // page: Validate
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded();
    });
  });
  describe('fail at check-in POST', () => {
    it('attempt check in, failed with a 200 and error message in the body', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withFailure(200);
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded('check-in-failed-find-out');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('fail at travel-pay POST', () => {
    it('attempt check in, failed on travel', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
      initializeBtsssPost.withFailure();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();
      Confirmation.validateBtsssIssue();
      Confirmation.validatePageLoadedWithBtsssGenericFailure();
      cy.injectAxeThenAxeCheck();
    });
  });
  // describe('fail at demographics PATCH', () => {
  //   it('attempt check in, failed on demographics update', () => {
  //     initializeSessionGet.withSuccessfulNewSession();
  //     initializeSessionPost.withSuccess();
  //     initializeDemographicsPatch.withFailure();
  //     initializeCheckInDataGet.withSuccess();
  //     initializeCheckInDataPost.withSuccess();
  //     cy.visitWithUUID();
  //     ValidateVeteran.validateVeteran();
  //     cy.injectAxeThenAxeCheck();
  //     ValidateVeteran.attemptToGoToNextPage();

  //     AppointmentsPage.validatePageLoaded();
  //     cy.injectAxeThenAxeCheck();
  //     AppointmentsPage.attemptCheckIn();

  //     Demographics.validatePageLoaded();
  //     cy.injectAxeThenAxeCheck();
  //     Demographics.attemptToGoToNextPage();

  //     EmergencyContact.validatePageLoaded();
  //     cy.injectAxeThenAxeCheck();
  //     EmergencyContact.attemptToGoToNextPage();

  //     NextOfKin.validatePage.dayOf();
  //     cy.injectAxeThenAxeCheck();
  //     NextOfKin.attemptToGoToNextPage();

  //     TravelPages.validatePageLoaded();
  //     cy.injectAxeThenAxeCheck();
  //     TravelPages.attemptToGoToNextPage('no');

  //     Confirmation.validateBtsssIssue();
  //     Confirmation.validatePageLoadedWithBtsssGenericFailure();
  //     cy.injectAxeThenAxeCheck();
  //   });
  // });
});
