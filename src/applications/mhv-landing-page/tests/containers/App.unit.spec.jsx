/* eslint-disable camelcase */
import React from 'react';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import App from '../../containers/App';
import { appName } from '../../manifest.json';

const stateFn = ({
  currentlyLoggedIn = true,
  featureTogglesLoading = false,
  profileLoading = false,
  serviceName = CSP_IDS.ID_ME,
  loa = 3,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    sign_in_service_enabled: true,
  },
  user: {
    profile: {
      loading: profileLoading,
      session: {
        ssoe: false,
      },
      loa: { current: loa },
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
    getByRole('heading', { name: 'My HealtheVet', level: 1 });
  });

  describe('renders a loading indicator when', () => {
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

  describe('renders landing page when', () => {
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
  });
});
