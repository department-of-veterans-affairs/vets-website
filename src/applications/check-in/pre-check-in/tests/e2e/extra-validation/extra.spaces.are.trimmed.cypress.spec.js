import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(function() {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withSuccess(req => {
        expect(req.body.session.lastName).to.equal('Smith');
        expect(req.body.session.last4).to.equal('1234');
      });
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation trims white space before posting', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();
      validateVeteran.validateVeteran('Smith        ', '1234          ');
      validateVeteran.attemptToGoToNextPage();

      introduction.validatePageLoaded();
    });
  });
});
