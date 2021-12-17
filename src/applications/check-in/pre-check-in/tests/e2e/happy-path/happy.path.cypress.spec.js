import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Confirmation from '../pages/Confirmation';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  let apiData = {};
  beforeEach(function() {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        emergencyContactEnabled: false,
      }),
    );
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();

    apiInitializer.initializeSessionPost.withSuccess();

    apiData = apiInitializer.initializePreCheckInDataGet.withSuccess();

    apiInitializer.initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Happy Path', () => {
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
    Confirmation.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
  });
});
