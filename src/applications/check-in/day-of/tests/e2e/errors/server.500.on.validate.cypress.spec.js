import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply(500, mockSession.createMockFailedResponse({}));
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
  it('C5736 - Validate - 500 api error', () => {
    Error.validateURL();
    Error.validatePageLoaded();
  });
});
