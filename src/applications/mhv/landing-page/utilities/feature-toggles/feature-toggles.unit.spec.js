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
    it('app is disabled if the the feature toggle is disabled', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: false,
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
    it('app is disabled if the feature is enabled but the user is not logged in', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
    it('app is enabled if the feature is enabled; the user is logged in as idme', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        user: {
          profile: {
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
            facilities: [
              {
                facilityId: '663',
                isCerner: false,
              },
            ],
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.true;
    });
    it('app is enabled if the feature is enabled; the user is logged in as login.gov', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        user: {
          profile: {
            signIn: {
              serviceName: CSP_IDS.LOGIN_GOV,
            },
            facilities: [
              {
                facilityId: '668',
                isCerner: false,
              },
            ],
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.true;
    });
    it('app is disabled if the feature is enabled; the user is logged in as dslogon', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        user: {
          profile: {
            signIn: {
              serviceName: CSP_IDS.DS_LOGON,
            },
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
    it('app is disabled if the feature is enabled AND the user is logged in as a valid ID provider AND the user is a cerner patient', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [
                {
                  vhaId: '668',
                  ehr: 'cerner',
                },
              ],
            },
          },
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
              },
            ],
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
    it('app is enabled if the feature is enabled AND the user is logged in as a valid ID provider AND the user is not a cerner patient', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              cernerFacilities: [
                {
                  vhaId: '668',
                  ehr: 'cerner',
                },
              ],
            },
          },
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: 'not-668',
                isCerner: false,
              },
            ],
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.true;
    });
    it('app is disabled if the feature is enabled AND the user is logged AND has no facilities', () => {
      const state = {
        featureToggles: {
          mhv_landing_page_enabled: true,
        },
        user: {
          profile: {
            facilities: [],
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
      };
      const result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
  });
});
