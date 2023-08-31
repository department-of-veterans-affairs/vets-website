import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulReturningSession();
    const now = Date.now();
    const today = new Date(now);
    initializeCheckInDataGet.withSuccess({
      demographicsNeedsUpdate: false,
      demographicsConfirmedAt: today.toISOString(),
      nextOfKinNeedsUpdate: false,
      nextOfKinConfirmedAt: today.toISOString(),
      emergencyContactNeedsUpdate: false,
      emergencyContactConfirmedAt: today.toISOString(),
    });
    initializeCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Returning user', () => {
    cy.visitWithUUID();
    Appointments.validatePageLoaded();
    Appointments.validateAppointmentLength(1);
    cy.injectAxe();
    cy.axeCheck();
    Appointments.attemptCheckIn(1);
    Confirmation.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
  });
});
