import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';
import Demographics from '../../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../../tests/e2e/pages/EmergencyContact';
import Arrived from '../../pages/Arrived';

describe('Check In Experience ', () => {
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
    initializeDemographicsPatch.withSuccess();
    initializeCheckInDataGet.withBadData();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Render Error is caught', () => {
    cy.visitWithUUID();
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Arrived.validateArrivedPage();
    Arrived.attemptToGoToNextPage();
    Demographics.attemptToGoToNextPage();
    EmergencyContact.attemptToGoToNextPage();
    NextOfKin.attemptToGoToNextPage();
    // Fails on the rendering of the API call
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
