import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
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
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('shows the numeric keypad on mobile devices', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();
      cy.get('[label="Last 4 digits of your Social Security number"]').should(
        'have.attr',
        'inputmode',
        'numeric',
      );
    });
  });
});
