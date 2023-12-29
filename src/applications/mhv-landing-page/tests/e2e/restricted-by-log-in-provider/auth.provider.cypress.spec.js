import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    const mhvAuthRedirectUrl = 'https://pint.eauth.va.gov/mhv-portal-web/eauth';
    cy.intercept('GET', mhvAuthRedirectUrl, '').as('mhvAuthRedirect');

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

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('landing page is enabled for DS Logon', () => {
    LandingPage.visitPage({ serviceProvider: CSP_IDS.DS_LOGON });
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });
});
