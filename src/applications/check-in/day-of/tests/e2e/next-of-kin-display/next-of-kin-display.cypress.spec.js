import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';

describe('Check In Experience', () => {
  describe('Next of kin Page', () => {
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
      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('next of kin display', () => {
      NextOfKin.validateNextOfKinFields();
      NextOfKin.validateNextOfKinData();
    });
  });
});
