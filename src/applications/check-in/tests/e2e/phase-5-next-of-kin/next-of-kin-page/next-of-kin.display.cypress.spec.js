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
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('next of kin display', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.signIn();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current contact information?');

      cy.get('[data-testid=yes-button]').click();

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Is this your current next of kin information?');

      cy.get('.check-in-next-of-kin dl')
        .find('dt:nth-child(1)')
        .should('have.text', 'Name')
        .next()
        .should('have.text', 'VETERAN,JONAH')
        .next()
        .should('have.text', 'Relationship')
        .next()
        .should('have.text', 'BROTHER')
        .next()
        .should('have.text', 'Address')
        .next()
        .should('have.text', '123 Main St, Ste 234Los Angeles, CA 90089')
        .next()
        .should('have.text', 'Phone')
        .next()
        .should('have.text', '111-222-3333')
        .next()
        .should('have.text', 'Work phone')
        .next()
        .should('have.text', '444-555-6666');
    });
  });
});
