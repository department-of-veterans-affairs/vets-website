import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 5 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: true,
          checkInExperienceNextOfKinEnabled: true,
          emergencyContactEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff display from emergency contact', () => {
      cy.visitWithUUID();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();

      cy.get('[data-testid=yes-button]', { timeout: Timeouts.slow }).click();
      cy.get('[data-testid=yes-button]', { timeout: Timeouts.slow }).click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current emergency contact?');

      cy.get('[data-testid=no-button]', { timeout: Timeouts.slow }).click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in with a staff member');
    });
  });
});
