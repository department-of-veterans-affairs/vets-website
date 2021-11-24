import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import Timeouts from 'platform/testing/e2e/timeouts';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';

describe.skip('Pre-Check In Experience -- Skipped', () => {
  // @TODO: un-skip when the error page is created.
  describe('Validate Page', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      validateVeteran.initializeSessionPost.withFailure();
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
      // @TODO: update when the error page is created.
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'We couldn’t check you in');
    });
  });
});
