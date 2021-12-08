import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

import validateVeteran from '../../pages/ValidateVeteran';
import introduction from '../../pages/Introduction';
import NextOfKin from '../../pages/NextOfKin';
import Demographics from '../../pages/Demographics';
import Error from '../../pages/Error';

import apiInitializer from '../../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/pre_check_ins/', () => {
      let apiData = {};
      beforeEach(function() {
        cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
        apiInitializer.initializeSessionGet.withSuccessfulNewSession();

        apiInitializer.initializeSessionPost.withSuccess();

        apiData = apiInitializer.initializePreCheckInDataGet.withSuccess();

        apiInitializer.initializePreCheckInDataPost.withFailure(400);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('bad status code (400)', () => {
        cy.visitPreCheckInWithUUID();
        // page: Validate
        validateVeteran.validatePageLoaded();
        validateVeteran.validateVeteran();
        cy.injectAxe();
        cy.axeCheck();

        validateVeteran.attemptToGoToNextPage();

        // page: Introduction
        introduction.validatePageLoaded();
        introduction.countAppointmentList(apiData.payload.appointments.length);
        cy.injectAxe();
        cy.axeCheck();
        introduction.attemptToGoToNextPage();

        // page: Demographics
        Demographics.validatePageLoaded();
        cy.injectAxe();
        cy.axeCheck();
        Demographics.attemptToGoToNextPage();

        // page: Next of Kin
        NextOfKin.validatePageLoaded();
        cy.injectAxe();
        cy.axeCheck();
        NextOfKin.attemptToGoToNextPage();

        // page: Confirmation
        Error.validatePageLoaded();
      });
    });
  });
});
