import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
        }),
      );
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('shows the numeric keypad on mobile devices', () => {
      ValidateVeteran.validateLast4InputType();
    });
  });
});
