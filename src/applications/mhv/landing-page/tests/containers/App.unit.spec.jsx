/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import App from '../../containers/App';
import { appName } from '../../manifest.json';

const stateFn = ({
  currentlyLoggedIn = true,
  facilities = [{ facilityId: '655', isCerner: false }],
  featureTogglesLoading = false,
  mhv_landing_page_enabled = true,
  profileLoading = false,
  serviceName = CSP_IDS.ID_ME,
  vamcEhrDataLoading = false,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    mhv_landing_page_enabled,
    sign_in_service_enabled: true,
  },
  drupalStaticData: {
    vamcEhrData: {
      loading: vamcEhrDataLoading,
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
      loading: profileLoading,
      facilities,
      session: {
        ssoe: false,
      },
      signIn: {
        serviceName,
      },
    },
    login: {
      currentlyLoggedIn,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<App />, { initialState });

describe(`${appName} -- <App /> container`, () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { text: 'My HealtheVet', level: 1 });
  });

  it('prompts to log in when logged out', () => {
    const initialState = stateFn({ currentlyLoggedIn: false });
    const { getByRole } = setup({ initialState });
    // getByRole('heading', { text: 'Sign in', level: 1 });
    getByRole('progressbar', { text: 'Redirecting to login...' });
  });

  describe('renders a loading indicator when', () => {
    it('drupalStaticData.vamcEhrData is loading', () => {
      const initialState = stateFn({ vamcEhrDataLoading: true });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
    });

    it('featureToggles is loading', () => {
      const initialState = stateFn({ featureTogglesLoading: true });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
    });

    it('profile is loading', () => {
      const initialState = stateFn({ profileLoading: true });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
    });
  });

  describe('redirects when', () => {
    let originalLocation;
    let replace;

    beforeEach(() => {
      originalLocation = window.location;
      replace = sinon.spy();
      window.location = { replace };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('feature toggle is disabled', () => {
      const initialState = stateFn({ mhv_landing_page_enabled: false });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      expect(replace.calledOnce).to.be.true;
    });

    it('signed in with DS Logon', () => {
      const initialState = stateFn({ serviceName: CSP_IDS.DS_LOGON });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      expect(replace.calledOnce).to.be.true;
    });

    it('user has a Cerner facility', () => {
      const facilities = [{ facilityId: '668' }];
      const initialState = stateFn({ facilities });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      expect(replace.calledOnce).to.be.true;
    });

    it('user has one Cerner facility', () => {
      const facilities = [
        { facilityId: '655' },
        { facilityId: '668' },
        { facilityId: '650' },
      ];
      const initialState = stateFn({ facilities });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      expect(replace.calledOnce).to.be.true;
    });

    it('user has no facilities', () => {
      const initialState = stateFn({ facilities: [] });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      expect(replace.calledOnce).to.be.true;
    });
  });
});
