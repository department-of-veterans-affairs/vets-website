import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import AlertUnregistered from '../../../components/alerts/AlertUnregistered';

const { headline } = AlertUnregistered.defaultProps;
const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

describe(appName, () => {
  describe('Display content based on patient registration', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
        ApiInitializer.initializeMessageData.withNoUnreadMessages();
      });

      it(`unregistered patient on ${size} screen`, () => {
        cy.viewportPreset(size);

        LandingPage.visit({
          registered: false,
          verified: false,
          serviceName: 'dslogon',
        });
        cy.injectAxeThenAxeCheck();

        // Test that the no health data message is present
        cy.findByRole('heading', { name: new RegExp(headline) }).should.exist;

        // Check the cards are not visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should('not.exist');

        // Check the hubs are visible
        cy.findAllByTestId(/^mhv-link-group-hub-/).should('not.exist');

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /VA health benefits/i }).should(
          'not.exist',
        );
      });

      it(`registered patient on ${size} screen`, () => {
        cy.viewportPreset(size);

        LandingPage.visit();
        cy.injectAxeThenAxeCheck();

        // Check the cards and hubs are visible
        cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
        cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /VA health benefits/i }).should.exist;

        // Test that the no health data message is NOT present
        cy.findByRole('heading', { name: new RegExp(headline) }).should(
          'not.exist',
        );
      });
    });
  });
});
