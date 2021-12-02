import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import NextOfKin from '../pages/NextOfKin';
import Demographics from '../pages/Demographics';
import Confirmation from '../pages/Confirmation';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  let apiData = {};
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();

    apiInitializer.initializeSessionPost.withSuccess();

    apiData = apiInitializer.initializePreCheckInDataGet.withSuccess();
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
