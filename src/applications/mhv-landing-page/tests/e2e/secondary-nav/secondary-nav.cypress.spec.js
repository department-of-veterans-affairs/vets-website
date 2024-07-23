import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- MHV Secondary Nav enabled`, () => {
  describe('registered user', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit();
      LandingPage.secondaryNavRendered();
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unverified user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ verified: false, registered: false });
      LandingPage.secondaryNav().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ registered: false });
      LandingPage.secondaryNav().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('user without MHV account', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ mhvAccountState: false });
      LandingPage.secondaryNavRendered();
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe(`${appName} -- MHV Secondary Nav disabled`, () => {
  it('does not render', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    LandingPage.visit();
    LandingPage.secondaryNav().should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
