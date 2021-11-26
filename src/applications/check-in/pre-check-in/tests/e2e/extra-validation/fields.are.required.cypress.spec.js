import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('Validation Page', () => {
    beforeEach(function() {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
        }),
      );
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      validateVeteran.initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed shows error messages', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();
      validateVeteran.attemptToGoToNextPage();

      cy.get('[label="Your last name"]')
        .shadow()
        .find('#error-message')
        .contains('Please enter your last name.');

      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('#error-message')
        .contains(
          'Please enter the last 4 digits of your Social Security number',
        );

      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();
      introduction.validatePageLoaded();
    });
  });
});
