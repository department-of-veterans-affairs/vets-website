import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.alreadyAuthenticated();
    cy.getAppointments();
    cy.successfulCheckin();
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
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
