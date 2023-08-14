import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('restrict access based on patient facilities', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with no facilities', () => {
      ApiInitializer.initializeUserData.withFacilities({ facilities: [] });
      LandingPage.visitPageAsCernerPatient();
      LandingPage.validateRedirectHappened();
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
