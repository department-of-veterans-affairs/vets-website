import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  describe('restrict access based on patient facilities', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      const mhvRedirectUrl = 'https://**.myhealth.va.gov/**';
      cy.intercept('GET', mhvRedirectUrl, '').as('mhvRedirect');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with no facilities', () => {
      LandingPage.visitPage({ facilities: [] });
      cy.wait('@mhvRedirect');
    });

    it('landing page is enabled for patients with facilities', () => {
      LandingPage.visitPage({
        facilities: [{ facilityId: '123', isCerner: false }],
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
    });
  });
});
