import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  describe('update skip path -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getUpdateNOK();
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
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('update next of kin only path', () => {
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
  });
});
