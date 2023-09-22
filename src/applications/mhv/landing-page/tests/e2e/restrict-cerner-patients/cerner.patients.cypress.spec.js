import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  describe('when user is a Cerner patient', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      const mhvRedirectUrl =
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home';
      cy.intercept('GET', mhvRedirectUrl, '').as('mhvRedirect');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withCernerPatient();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for Cerner patients', () => {
      LandingPage.visitPageAsCernerPatient();
      LandingPage.validateRedirectHappened();
      cy.wait('@mhvRedirect');
    });
  });

  describe('when user is not Cerner patient', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withDefaultUser();
    });
    it('landing page is enabled for non-Cerner patients', () => {
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
    });
  });
});
