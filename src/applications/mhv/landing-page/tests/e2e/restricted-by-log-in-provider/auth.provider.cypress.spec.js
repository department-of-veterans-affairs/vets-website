import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is enabled for idme', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.ID_ME });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });

  it('landing page is enabled for login gov', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.LOGIN_GOV });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('landing page is disabled for dslogon', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.DS_LOGON });
    LandingPage.validateRedirectHappened();
  });
});
