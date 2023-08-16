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
    it('feature toggle is disabled', () => {
      const originalWindow = global.window;
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const initialState = stateFn({ mhv_landing_page_enabled: false });
      setup({ initialState });
      expect(replace.called).to.be.true;
      global.window = originalWindow;
    });

    it('signed in with DS Logon', () => {
      const originalWindow = global.window;
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const initialState = stateFn({ serviceName: CSP_IDS.DS_LOGON });
      setup({ initialState });
      expect(replace.called).to.be.true;
      global.window = originalWindow;
    });

    it('user has a Cerner facility', () => {
      const originalWindow = global.window;
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const facilities = [{ facilityId: '668', isCerner: false }];
      const initialState = stateFn({ facilities });
      setup({ initialState });
      expect(replace.called).to.be.true;
      global.window = originalWindow;
    });

    it('user has no facilities', () => {
      const originalWindow = global.window;
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const initialState = stateFn({ facilities: [] });
      setup({ initialState });
      expect(replace.called).to.be.true;
      global.window = originalWindow;
    });
  });
});
