/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';

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

  // TODO: THIS TEST IS NOT COMPATIBLE WITH WEB COMPONENTS
  // it('prompts to log in when logged out', () => {
  //   const initialState = stateFn({ currentlyLoggedIn: false });
  //   const { getByRole } = setup({ initialState });
  //   // // getByRole('heading', { text: 'Sign in', level: 1 });
  //   getByRole('progressbar', { text: 'Redirecting to login...' });
  // });

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
    const originalLocation = window.location;
    let replace;

    beforeEach(() => {
      replace = sinon.spy();
      Object.defineProperty(window, 'location', {
        value: { replace },
      });
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('feature toggle is disabled', async () => {
      const initialState = stateFn({ mhv_landing_page_enabled: false });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      await waitFor(() => {
        expect(replace.calledOnce).to.be.true;
      });
    });

    it('signed in with DS Logon', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.DS_LOGON });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('signed in with Login.gov', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.LOGIN_GOV });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('signed in with id.me', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.ID_ME });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('signed in with MHV', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.MHV });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('user has one facility and one Cerner facility', async () => {
      const facilities = [{ facilityId: '668' }];
      const initialState = stateFn({ facilities });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('user has many facilities and one Cerner facility', async () => {
      const facilities = [
        { facilityId: '655' },
        { facilityId: '668' },
        { facilityId: '650' },
      ];
      const initialState = stateFn({ facilities });
      const { getByTestId } = setup({ initialState });
      getByTestId('landing-page-container');
    });

    it('user has no facilities', async () => {
      const initialState = stateFn({ facilities: [] });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      await waitFor(() => {
        expect(replace.calledOnce).to.be.true;
      });
    });
  });
});
