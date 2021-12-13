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
          checkInExperienceMultipleAppointmentSupport: true,
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff display with demographics message', () => {
      cy.visitWithUUID();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();
      cy.get('[data-testid=no-button]', { timeout: Timeouts.slow }).click();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in with a staff member');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('h1')
        .next()
        .should('be.visible')
        .and(
          'have.text',
          'Our staff can help you update your contact information.',
        );
    });
    it('see staff page has BTSSS link', () => {
      cy.visitWithUUID();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();
      cy.get('[data-testid=no-button]', { timeout: Timeouts.slow }).click();
      cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
      cy.get('a[data-testid="btsss-link"]').should(
        'have.text',
        'Find out how to request travel pay reimbursement',
      );
      cy.get('a[data-testid="btsss-link"]')
        .invoke('attr', 'href')
        .should('contain', '/health-care/get-reimbursed-for-travel-pay/');
    });
  });
});
