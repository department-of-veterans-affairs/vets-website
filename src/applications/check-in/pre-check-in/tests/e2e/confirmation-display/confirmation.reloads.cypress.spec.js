import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import introduction from '../pages/Introduction';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Confirmation from '../pages/Confirmation';
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
      apiInitializer.initializePreCheckInDataGet.withSuccess();

      apiInitializer.initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();
      introduction.validatePageLoaded();
      introduction.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    it('reloads of confirmation page should redirect back to verify page', () => {
      cy.injectAxeThenAxeCheck();
      cy.reload();
      validateVeteran.validatePageLoaded();

      // moved afterEach here to
      // avoid async clearing of session storage
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
  });
});
