import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(400, mockSession.createMockFailedResponse());
      });
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      Error.validatePageLoaded();
    });
  });
});
