import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import Demographics from '../pages/Demographics';
import NextOfKin from '../pages/NextOfKin';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('Next of kin Page', () => {
    beforeEach(function() {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
        }),
      );
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withSuccess();
      cy.visitPreCheckInWithUUID();
      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();
      introduction.validatePageLoaded();
      introduction.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Displays each field', () => {
      NextOfKin.validateNextOfKinFields();
    });
    it('Displays correct next of kin data', () => {
      NextOfKin.validateNextOfKinData();
    });
  });
});
