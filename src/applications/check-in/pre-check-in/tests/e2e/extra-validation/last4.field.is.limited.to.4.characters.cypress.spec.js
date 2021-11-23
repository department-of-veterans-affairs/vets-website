import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(function() {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: true,
        }),
      );
      validateVeteran.initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('only allows typing 4 characters', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();
      validateVeteran.typeLast4('12345');

      validateVeteran
        .getLast4Input()
        .should('be.visible')
        .and('have.value', '1234');

      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('small')
        .should('be.visible')
        .and('have.text', '(Max. 4 characters)');
    });
  });
});
