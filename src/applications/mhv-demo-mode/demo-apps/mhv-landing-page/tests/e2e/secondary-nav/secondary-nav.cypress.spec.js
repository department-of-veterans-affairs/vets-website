import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- MHV Secondary Nav enabled`, () => {
  describe('registered user', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visit();
      LandingPage.secondaryNavRendered();
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unverified user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visit({ verified: false, registered: false });
      LandingPage.secondaryNav().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visit({
        registered: false,
        verified: false,
        serviceName: 'dslogon',
      });
      LandingPage.secondaryNav().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('user without MHV account', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visit({ mhvAccountState: false });
      LandingPage.secondaryNavRendered();
      cy.injectAxeThenAxeCheck();
    });
  });
});
