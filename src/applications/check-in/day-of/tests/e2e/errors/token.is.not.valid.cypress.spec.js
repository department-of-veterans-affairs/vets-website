import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Error from '../../../../tests/e2e/pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply({
        statusCode: 200,
        body: mockSession.createMockFailedResponse({}),
        delay: 10, // milliseconds
      });
    });
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    cy.visitWithUUID();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5738 - Token is not valid', () => {
    Error.validatePageLoaded();
  });
});
