import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import NextOfKin from '../pages/NextOfKin';
import Demographics from '../pages/Demographics';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  let apiData = {};
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();

    apiInitializer.initializeSessionPost.withSuccess();

    apiData = apiInitializer.initializePreCheckInDataGet.withSuccess();

    apiInitializer.initializePreCheckInDataPost.withSuccess(req => {
      expect(req.body.preCheckIn.uuid).to.equal(
        '0429dda5-4165-46be-9ed1-1e652a8dfd83',
      );
      expect(req.body.preCheckIn.demographicsUpToDate).to.equal(false);
      expect(req.body.preCheckIn.nextOfKinUpToDate).to.equal(false);
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Answered no to both questions', () => {
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
    Demographics.attemptToGoToNextPage('no');

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
    NextOfKin.attemptToGoToNextPage('no');

    // page: Confirmation
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Confirmation');
    cy.injectAxe();
    cy.axeCheck();
  });
});
