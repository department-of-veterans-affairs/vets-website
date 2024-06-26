import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

const noHealthDataHeading = /You don’t have access to My HealtheVet/i;

describe(appName, () => {
  describe('Display content based on patient registration', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
        ApiInitializer.initializeMessageData.withNoUnreadMessages();
      });

      it(`unregistered patient on ${size} screen`, () => {
        cy.viewportPreset(size);

        LandingPage.visit({ registered: false });
        cy.injectAxeThenAxeCheck();

        // Test that the no health data message is present
        cy.findByRole('heading', {
          name: noHealthDataHeading,
        }).should.exist;

        // Check the cards are not visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should('not.exist');

        // Check the hubs are visible
        cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /VA health benefits/i }).should.exist;
      });

      it(`registered patient on ${size} screen`, () => {
        cy.viewportPreset(size);

        LandingPage.visit();
        cy.injectAxeThenAxeCheck();

        // Check the cards and hubs are visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
        cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /My VA health benefits/i }).should
          .exist;

        // Test that the no health data message is NOT present
        cy.findByRole('heading', {
          name: noHealthDataHeading,
        }).should('not.exist');
      });
    });
  });
});
