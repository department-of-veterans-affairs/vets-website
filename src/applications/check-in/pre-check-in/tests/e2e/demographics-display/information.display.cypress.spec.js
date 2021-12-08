import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import Demographics from '../pages/Demographics';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('Demographics Page', () => {
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

      apiInitializer.initializePreCheckInDataGet.withSuccess();

      cy.visitPreCheckInWithUUID();
      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();
      introduction.validatePageLoaded();
      introduction.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Displays each field', () => {
      Demographics.validateDemographicsFields();
    });
    it('Displays correct demographic data', () => {
      Demographics.validateDemographicData();
    });
  });
});
