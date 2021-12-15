import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  describe('Confirmation display -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments();
      cy.successfulCheckin();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(2);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('confirm page display', () => {
      Confirmation.validatePageLoaded();
      cy.injectAxe();
      cy.axeCheck();
    });
    it('confirm page has BTSSS link', () => {
      Confirmation.validateBTSSSLink();
    });
    it('confirm back button', () => {
      Confirmation.validateBackButton();
    });
  });
});
