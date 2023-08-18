/* eslint-disable camelcase */
import { expect } from 'chai';
import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { isLandingPageEnabledForUser } from '../../selectors';
import { appName } from '../../manifest.json';

const stateFn = ({
  currentlyLoggedIn = true,
  facilities = [{ facilityId: '655', isCerner: false }],
  mhv_landing_page_enabled = true,
  serviceName = CSP_IDS.ID_ME,
} = {}) => ({
  featureToggles: {
    mhv_landing_page_enabled,
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
      facilities,
      signIn: {
        serviceName,
      },
    },
    login: {
      currentlyLoggedIn,
    },
  },
});

let result;
let state;

describe(`${appName} -- isLandingPageEnabledForUser selector`, () => {
  describe('returns true when', () => {
    it('user signed in with ID.me, feature enabled, has non-Cerner facility', () => {
      state = stateFn();
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.true;
    });

    it('user signed in with Login.gov', () => {
      state = stateFn({ serviceName: CSP_IDS.LOGIN_GOV });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.true;
    });
  });

  describe('returns false when', () => {
    it('feature toggle is off', () => {
      state = stateFn({ mhv_landing_page_enabled: false });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });

    it('user is logged out', () => {
      state = stateFn({ currentlyLoggedIn: false });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });

    it('user signed in with DS Logon', () => {
      state = stateFn({ serviceName: CSP_IDS.DS_LOGON });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });

    it('user is a Cerner patient', () => {
      // NOTE: selectPatientFacilities will change isCerner property since facilityId
      // 668 is listed as a Cerner facility in state.drupalStaticData.vamcEhrData.
      const facilities = [
        { facilityId: '655', isCerner: false },
        { facilityId: '650', isCerner: false },
        { facilityId: '668', isCerner: false },
      ];
      state = stateFn({ facilities });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });

    it('user has no facilities', () => {
      state = stateFn({ facilities: [] });
      result = isLandingPageEnabledForUser(state);
      expect(result).to.be.false;
    });
  });
});
