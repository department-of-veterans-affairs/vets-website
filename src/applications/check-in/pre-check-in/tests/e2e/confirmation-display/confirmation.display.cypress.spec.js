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
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Confirmation page content loads', () => {
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    it('Staff update alert message is not visible', () => {
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validateConfirmNoUpdates();
    });
    it('Staff update alert message is visible', () => {
      NextOfKin.attemptToGoToNextPage('no');
      Confirmation.validateConfirmWithUpdates();
    });
  });
});
