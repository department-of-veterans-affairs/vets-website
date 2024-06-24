import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  let apiData;
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

    apiData = initializePreCheckInDataGet.withCanceledAppointment();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Every appointment is cancelled should result in an appointment cancelled Error Page', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();

    // UUID with canceled appointments should navigate to the error page.
    Error.validateCanceledPageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--canceled-appointment');
  });
  it('Not every appointment is cancelled should result in a generic Error Page', () => {
    apiData.payload.appointments[1].status = '';
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();

    // UUID with canceled appointments should navigate to the error page.
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--possible-canceled-appointment');
  });
});
