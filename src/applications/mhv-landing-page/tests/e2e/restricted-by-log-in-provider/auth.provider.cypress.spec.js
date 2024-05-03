import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { appName } from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is enabled for ID.me', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.ID_ME });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });

  it('landing page is enabled for Login.gov', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.LOGIN_GOV });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });

  it('landing page is enabled for DS Logon', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.DS_LOGON });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });
});
