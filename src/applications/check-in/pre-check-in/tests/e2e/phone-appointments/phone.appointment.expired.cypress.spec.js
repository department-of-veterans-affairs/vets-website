import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../pages/Error';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
      initializePreCheckInDataPost,
      initializeDemographicsPatch,
    } = ApiInitializer;
    initializeFeatureToggle.withAllFeatures();
    initializeDemographicsPatch.withSuccess();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataGet.withSuccess({
      uuid: '08ba56a7-68b7-4b9f-b779-53ba609140ef',
    });

    initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Expired appointment', () => {
    cy.visitPreCheckInWithUUID('08ba56a7-68b7-4b9f-b779-53ba609140ef');
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();

    // Expired UUID should navigate to an error
    Error.validatePageLoadedExpired();
    Error.validateAccordionBlocks();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Phone-appointment--expired-error');
  });
});
