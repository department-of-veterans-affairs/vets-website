import manifest from '../../../manifest.json';
import { generateUser } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('Cerner facility info alert', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    it('renders info alert and learn more link when userFacilityReadyForInfoAlert is true', () => {
      const oracleHealthUser = generateUser({ oracleHealth: true });
      LandingPage.visit({ user: oracleHealthUser });

      // Info alert should be visible
      cy.findByTestId('cerner-facilities-info-alert').should('exist');

      // Expand the alert by clicking on it
      cy.findByTestId('cerner-facilities-info-alert').click();

      // Verify expanded content is visible
      cy.findByTestId('cerner-facility-info-text').should('be.visible');
      cy.contains('brought all your VA health care data together').should(
        'be.visible',
      );
      cy.contains('Still want to use My VA Health for now?').should(
        'be.visible',
      );

      // Verify "Go to My VA Health" link exists
      cy.findByTestId('cerner-info-alert-link')
        .should('exist')
        .should('have.attr', 'text', 'Go to My VA Health');

      // Learn more text should be visible (using contains for curly apostrophe)
      cy.contains('Want to learn more about what').should('exist');

      // Learn more link should be visible and have correct href
      cy.get('va-link[text="Learn more about My HealtheVet on VA.gov"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          '/resources/my-healthevet-on-vagov-what-to-know',
        );

      cy.injectAxeThenAxeCheck();
    });

    it('does not render info alert or learn more link when userFacilityReadyForInfoAlert is false', () => {
      const defaultUser = generateUser({ oracleHealth: false });
      LandingPage.visit({ user: defaultUser });

      // Info alert should not be visible
      cy.findByTestId('cerner-facilities-info-alert').should('not.exist');

      // Learn more text should not be visible
      cy.contains('Want to learn more about what').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
