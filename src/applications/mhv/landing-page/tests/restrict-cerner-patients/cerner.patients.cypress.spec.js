import manifest from '../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('when user is a cerner patient', () => {
    beforeEach(() => {
      ApiInitializer.initializeVamcEhrData.withSelectFacilities();
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withCernerPatient();
    });
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for cerner patients', () => {
      LandingPage.visitPageAsCernerPatient();
      LandingPage.validateRedirectHappened();
    });
  });
  describe('when user is not cerner patient', () => {
    beforeEach(() => {
      ApiInitializer.initializeVamcEhrData.withSelectFacilities();
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withDefaultUser();
    });
    it('landing page is enabled for non-cerner patients', () => {
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
    });
  });
});
