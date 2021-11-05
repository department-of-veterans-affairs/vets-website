import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../../support/commands';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v2/patient_check_ins//*', req => {
      req.reply(403, mockSession.createMockFailedResponse({}));
    });

    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5728 - Check in - 404 api error', () => {
    cy.visitWithUUID();

    cy.url().should('match', /error/);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
