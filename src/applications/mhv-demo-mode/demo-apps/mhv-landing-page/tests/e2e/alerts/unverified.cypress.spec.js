import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

describe(appName, () => {
  describe('Display content based on identity verification', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      });

      it(`Shows unverified identity message on ${size} screen`, () => {
        const userIsVerified = false;
        const userIsRegistered = false;

        cy.viewportPreset(size);

        LandingPage.visit({
          registered: userIsRegistered,
          verified: userIsVerified,
          showVerifyAndRegisterAlert: false,
        });
        cy.injectAxeThenAxeCheck();

        // Test that the unverified identity message is present
        cy.findByTestId('mhv-alert--verify-and-register').should('exist');

        // Check the cards are not visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should('not.exist');

        // Check the hubs are visible
        cy.findAllByTestId(/^mhv-link-group-hub-/).should('not.exist');

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: 'VA health benefits' }).should(
          'not.exist',
        );
      });

      it(`Shows landing page on ${size} screen`, () => {
        const userIsVerified = true;
        const userIsRegistered = true;

        cy.viewportPreset(size);

        LandingPage.visit({
          registered: userIsRegistered,
          verified: userIsVerified,
        });
        cy.injectAxeThenAxeCheck();

        // Check the cards and hubs are visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
        cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: 'VA health benefits' }).should.exist;

        // Test that the unverified identity message is NOT present
        cy.findByTestId('mhv-alert--verify-and-register').should('not.exist');
      });
    });
  });
});
