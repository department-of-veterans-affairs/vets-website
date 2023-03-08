/* eslint-disable camelcase */
import { expect } from 'chai';
import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { isLandingPageEnabledForUser } from './index';
import manifest from '../../manifest.json';

// x const { featureToggles, user } = state;
// x const { serviceName } = user?.profile?.signIn;
// x const { currentlyLoggedIn } = user?.login;
// const isCernerPatient = selectIsCernerPatient(state);

describe(manifest.appName, () => {
  describe('is landing page enabled for user', () => {
    it('the feature is disabled', () => {});
    it('the feature is enabled and the user is logged in as idme, then its enabled', () => {
      const toggles = {
        mhv_landing_page_enabled: true,
      };
      const result = isLandingPageEnabledForUser(toggles, CSP_IDS.ID_ME);
      expect(result).to.be.true;
    });
    it('the feature is enabled and the user is logged in as login.gov, then its enabled', () => {
      const toggles = {
        mhv_landing_page_enabled: true,
      };
      const result = isLandingPageEnabledForUser(toggles, CSP_IDS.LOGIN_GOV);
      expect(result).to.be.true;
    });
    it('the feature is enabled and the user is logged in as dslogon, then its disable', () => {
      const toggles = {
        mhv_landing_page_enabled: true,
      };
      const result = isLandingPageEnabledForUser(toggles, CSP_IDS.DS_LOGON);
      expect(result).to.be.false;
    });
    it('the feature is enabled  and the user is logged in as a cerner patient, then its disabled', () => {});
    it('the feature is enabled and the user is logged in and is not a cerner patient then its enabled', () => {});
  });
});
