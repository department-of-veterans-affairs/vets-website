import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockSessions from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../../support/commands';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply({
        statusCode: 200,
        body: mockSessions.createMockFailedResponse({}),
        delay: 10, // milliseconds
      });
    });
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5738 - Token is not valid', () => {
    cy.visitWithUUID();
    cy.get('h1').contains('We couldn’t check you in');
  });
});
