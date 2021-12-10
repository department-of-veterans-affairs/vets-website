import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 6 -- ', () => {
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
    it('emergency contact display', () => {
      cy.visitWithUUID();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();

      cy.get('[data-testid=yes-button]').click();
      cy.get('[data-testid=yes-button]').click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current emergency contact?');

      cy.get('.confirmable-page dl')
        .find('dt:nth-child(1)')
        .should('have.text', 'Name')
        .next()
        .should('have.text', 'Bugs Bunny')
        .next()
        .should('have.text', 'Relationship')
        .next()
        .should('have.text', 'Estranged Uncle')
        .next()
        .should('have.text', 'Address')
        .next()
        .should('have.text', '123 fake streetAlbuquerque, New Mexico 87102')
        .next()
        .should('have.text', 'Phone')
        .next()
        .should('have.text', '555-867-5309')
        .next()
        .should('have.text', 'Work phone')
        .next()
        .should('have.text', 'Not available');
    });
  });
});
