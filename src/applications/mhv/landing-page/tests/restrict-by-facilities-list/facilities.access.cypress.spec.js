import manifest from '../../manifest.json';

import { cernerUser, noFacilityUser } from '../../api/mocks/user';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('restrict access based on patient facilities', () => {
    beforeEach(() => {
      ApiInitializer.initializeVamcEhrData.withSelectFacilities();
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with no facilities', () => {
      ApiInitializer.initializeUserData.withFacilities({
        user: noFacilityUser,
        facilities: [],
      });
      LandingPage.validateRedirectHappens();
      LandingPage.visitPage({ user: noFacilityUser });
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with Cerner facilities', () => {
      ApiInitializer.initializeUserData.withCernerPatient();
      LandingPage.validateRedirectHappens();
      LandingPage.visitPage({ user: cernerUser });
    });

    it('landing page is enabled for patients with facilities', () => {
      ApiInitializer.initializeUserData.withDefaultUser();
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
    });
  });
});
