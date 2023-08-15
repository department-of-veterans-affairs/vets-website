import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  describe('restrict access based on patient facilities', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      const mhvRedirectUrl =
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home';
      cy.intercept('GET', mhvRedirectUrl, '').as('mhvRedirect');
      const mhvAuthRedirectUrl =
        'https://pint.eauth.va.gov/mhv-portal-web/eauth';
      cy.intercept('GET', mhvAuthRedirectUrl, '').as('mhvAuthRedirect');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with no facilities', () => {
      ApiInitializer.initializeUserData.withFacilities({ facilities: [] });
      LandingPage.visitPageAsCernerPatient();
      LandingPage.validateRedirectHappened();
      cy.wait('@mhvRedirect');
    });

    it('landing page is disabled for patients with facilities', () => {
      ApiInitializer.initializeUserData.withFacilities({
        facilities: [{ facilityId: '123', isCerner: false }],
      });

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
    });
  });
});
