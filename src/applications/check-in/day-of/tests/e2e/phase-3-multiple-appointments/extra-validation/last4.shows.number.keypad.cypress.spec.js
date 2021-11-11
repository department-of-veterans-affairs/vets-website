import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
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
    it('shows the numeric keypad on mobile devices', () => {
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.get('[label="Last 4 digits of your Social Security number"]').should(
        'have.attr',
        'inputmode',
        'numeric',
      );
    });
  });
});
