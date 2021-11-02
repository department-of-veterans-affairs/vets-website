import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 4 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments();
      cy.successfulCheckin();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
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
    it('demographics display', () => {
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
      cy.get('.check-in-demographics > p', { timeout: Timeouts.slow })
        .should('be.visible')
        .and(
          'have.text',
          'We can better follow up with you after your appointment when we have your current information.',
        );
      cy.get('.check-in-demographics dl')
        .find('dt:nth-child(1)')
        .should('have.text', 'Mailing address')
        .next()
        .should('have.text', '123 Turtle TrailTreetopper, Tennessee 10101')
        .next()
        .should('have.text', 'Home address')
        .next()
        .should(
          'have.text',
          '445 Fine Finch Fairway, Apt 201Fairfence, Florida 44554',
        )
        .next()
        .should('have.text', 'Home phone')
        .next()
        .should('have.text', '555-222-3333')
        .next()
        .should('have.text', 'Mobile phone')
        .next()
        .should('have.text', '555-333-4444')
        .next()
        .should('have.text', 'Work phone')
        .next()
        .should('have.text', '555-444-5555')
        .next()
        .should('have.text', 'Email address')
        .next()
        .should('have.text', 'kermit.frog@sesameenterprises.us');
    });
  });
});
