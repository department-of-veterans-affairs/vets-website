import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} - helpdesk information component`, () => {
  describe('display content based on user status', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
    });

    it(`does not render for unverified users`, () => {
      LandingPage.visitPage({ unverified: true });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`does not render for unregistered users`, () => {
      LandingPage.visitPage({ unregistered: true });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`renders for verified registered users`, () => {
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });
  });

  describe('display content based on feature toggle', () => {
    it(`toggle is off`, () => {
      ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`toggle is on`, () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });
  });
});
