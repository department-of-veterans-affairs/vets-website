import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments();
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
    it('only allows typing 4 characters', () => {
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('input')
        .type('12345');
      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('input')
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
