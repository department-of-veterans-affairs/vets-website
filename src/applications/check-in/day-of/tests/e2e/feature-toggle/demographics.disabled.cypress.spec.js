import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  describe('feature toggle -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getSingleAppointment();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: false,
        }),
      );
      cy.visitWithUUID();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('demographics disabled ', () => {
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
    });
  });
});
