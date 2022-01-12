import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  beforeEach(function() {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulReturningSession();
    initializeCheckInDataGet.withSuccess();
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
    Appointments.validateAppointmentLength(4);
    cy.injectAxe();
    cy.axeCheck();
    Appointments.attemptCheckIn(3);
    Confirmation.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
  });
});
