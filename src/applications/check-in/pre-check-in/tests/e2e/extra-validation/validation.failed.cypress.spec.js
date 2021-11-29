import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import error from '../pages/Error';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  // @TODO: un-skip when the error page is created.
  describe('Validate Page', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withFailure();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();

      validateVeteran.typeLastName('Smith');
      validateVeteran.typeLast4('1234');
      validateVeteran.attemptToGoToNextPage();

      error.validatePageLoaded();
    });
  });
});
