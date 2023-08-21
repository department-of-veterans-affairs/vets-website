import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';
import Confirmation from '../../pages/Confirmation';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataGet.withPast15MinuteWindow();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Render Error pre check in past 15 minutes', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();

    // Expired UUID should navigate to an error
    Error.validatePast15MinutesPageLoaded();
    Error.validateAccordionBlocks();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--past-15-min--default-accordions');
    Confirmation.expandAllAccordions();
    cy.createScreenshots('Pre-check-in--past-15-min--expanded-accordions');
  });
});
