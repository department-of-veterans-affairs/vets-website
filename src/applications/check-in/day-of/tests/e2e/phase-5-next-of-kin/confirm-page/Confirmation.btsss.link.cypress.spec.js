import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 5 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments({}, [], 1);
      cy.successfulCheckin();
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
    it.skip('confirm page has BTSSS link', () => {
      cy.visitWithUUID();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();
      cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
      cy.get('.usa-button').click();

      cy.get('[data-testid=multiple-appointments-confirm]', {
        timeout: Timeouts.slow,
      }).should('be.visible');
      cy.get('a[data-testid="btsss-link"]').should(
        'have.text',
        'Find out how to request travel pay reimbursement',
      );
      cy.get('a[data-testid="btsss-link"]')
        .invoke('attr', 'href')
        .should('contain', '/health-care/get-reimbursed-for-travel-pay/');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
