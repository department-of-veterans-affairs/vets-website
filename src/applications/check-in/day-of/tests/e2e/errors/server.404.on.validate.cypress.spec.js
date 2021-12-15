import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../support/commands';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply(404, mockSession.createMockFailedResponse({}));
    });
    cy.intercept('POST', '/check_in/v2/sessions', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.full'),
      );
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visitWithUUID();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5732 - Validate - 404 error', () => {
    Error.validateURL();
    Error.validatePageLoaded();
  });
});
