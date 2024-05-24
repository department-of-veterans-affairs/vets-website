import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- MHV Secondary Nav enabled`, () => {
  describe('registered user', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit();
      LandingPage.loaded();
      LandingPage.secondaryNavRendered();
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ registered: false });
      LandingPage.loaded();
      LandingPage.secondaryNav().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe(`${appName} -- MHV Secondary Nav disabled`, () => {
  it('does not render', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    LandingPage.visit();
    LandingPage.loaded();
    LandingPage.secondaryNav().should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
