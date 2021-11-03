import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.authenticate();
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5755 - On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
    cy.visitWithUUID();
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Check in at VA');
    cy.window().then(window => {
      const data = window.sessionStorage.getItem(
        'health.care.check-in.current.uuid',
      );
      const sample = JSON.stringify({
        token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
      });
      expect(data).to.equal(sample);
      cy.reload();
      // redirected back to landing page to reload the data
      cy.url().should('match', /id=46bebc0a-b99c-464f-a5c5-560bc9eae287/);

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
    });
  });
});
