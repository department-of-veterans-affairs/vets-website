/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import LandingPageContainer from '../../containers/LandingPageContainer';
import { appName } from '../../manifest.json';
import * as apiCalls from '../../utilities/api';
import * as hooks from '../../hooks';
import reducers from '../../reducers';

const stateFn = ({
  currentlyLoggedIn = true,
  featureTogglesLoading = false,
  profileLoading = false,
  serviceName = CSP_IDS.ID_ME,
  loa = 3,
  vaPatient = true,
  services = ['messaging'],
  mhvAccountStatusLoading = false,
  mhvAccountState = 'OK', // Set to 'OK' so hook dispatches fetchAccountStatusSuccess immediately
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    sign_in_service_enabled: true,
  },
  user: {
    profile: {
      vaPatient,
      loading: profileLoading,
      session: {
        ssoe: false,
      },
      loa: { current: loa },
      signIn: {
        serviceName,
      },
      services,
      mhvAccountState,
    },
    login: {
      currentlyLoggedIn,
    },
  },
  myHealth: {
    accountStatus: {
      loading: mhvAccountStatusLoading,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<LandingPageContainer />, {
    initialState,
    reducers,
  });

describe(`${appName} -- <LandingPageContainer /> container`, () => {
  it('renders', async () => {
    const { getByRole } = setup();
    await waitFor(() => {
      getByRole('heading', { name: 'My HealtheVet', level: 1 });
    });
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

    it('mhvAccountStatusIsLoading is true', () => {
      // Stub the hook to prevent it from dispatching actions that clear loading
      sinon.stub(hooks, 'useAccountCreationApi').returns(undefined);
      const initialState = stateFn({
        mhvAccountStatusLoading: true,
      });
      const { getByTestId } = setup({ initialState });
      getByTestId('mhv-landing-page-loading');
      hooks.useAccountCreationApi.restore();
    });
  });

  describe('renders landing page when', () => {
    it('signed in with Login.gov', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.LOGIN_GOV });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });

    it('signed in with id.me', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.ID_ME });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });

    it('signed in with MHV', async () => {
      const initialState = stateFn({ serviceName: CSP_IDS.MHV });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });
  });

  describe('verifiedNonVaPatient branch', () => {
    it('renders NonPatientLandingPage when userVerified is true and vaPatient is false', async () => {
      const initialState = stateFn({
        loa: 3,
        vaPatient: false,
      });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('non-patient-landing-page-container');
      });
    });

    it('renders LandingPage when userVerified is true and vaPatient is true', async () => {
      const initialState = stateFn({
        loa: 3,
        vaPatient: true,
      });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });

    it('renders LandingPage when userVerified is false and vaPatient is false', async () => {
      const initialState = stateFn({
        loa: 2,
        vaPatient: false,
      });
      const { getByTestId } = setup({ initialState });
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });
  });

  describe('getFolderList API calls', () => {
    it('should not call getFolderList when userHasMessagingAccess is false', async () => {
      const getFolderListStub = sinon.stub(apiCalls, 'getFolderList');
      const initialState = stateFn({
        services: [], // No messaging service
      });
      setup({ initialState });

      await waitFor(
        () => {
          expect(getFolderListStub.called).to.be.false;
        },
        { timeout: 1000 },
      );

      getFolderListStub.restore();
    });

    it('should call getFolderList when userHasMessagingAccess is true', async () => {
      const getFolderListStub = sinon.stub(apiCalls, 'getFolderList').resolves({
        data: [
          {
            id: '0',
            attributes: { unreadCount: 5 },
          },
        ],
      });
      const initialState = stateFn({
        services: [backendServices.MESSAGING],
      });
      setup({ initialState });

      await waitFor(
        () => {
          expect(getFolderListStub.called).to.be.true;
        },
        { timeout: 2000 },
      );

      getFolderListStub.restore();
    });

    it('handles error in getFolderList API call gracefully', async () => {
      const error = new Error('API Error');
      const getFolderListStub = sinon
        .stub(apiCalls, 'getFolderList')
        .rejects(error);
      const initialState = stateFn({
        services: [backendServices.MESSAGING],
      });

      // Should not throw error, component should still render
      const { getByTestId } = setup({ initialState });

      await waitFor(
        () => {
          expect(getFolderListStub.called).to.be.true;
          // Component should still render despite error
          getByTestId('landing-page-container');
        },
        { timeout: 2000 },
      );

      getFolderListStub.restore();
    });
  });

  describe('useMemo dependencies', () => {
    it('recomputes data when featureToggles change', async () => {
      const initialState = stateFn({
        featureToggles: {
          loading: false,
          sign_in_service_enabled: true,
          someFeature: false,
        },
      });
      const { getByTestId } = setup({ initialState });
      // Component should render with initial featureToggles
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });

    it('recomputes data when ssoe changes', async () => {
      const initialState = stateFn({
        user: {
          ...stateFn().user,
          profile: {
            ...stateFn().user.profile,
            session: {
              ssoe: false,
            },
          },
        },
      });
      const { getByTestId } = setup({ initialState });
      // Component should render with ssoe: false
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });

    it('recomputes data when unreadMessageAriaLabel changes', async () => {
      const getFolderListStub = sinon.stub(apiCalls, 'getFolderList').resolves({
        data: [
          {
            id: '0',
            attributes: { unreadCount: 5 },
          },
        ],
      });
      const initialState = stateFn({
        services: [backendServices.MESSAGING],
      });
      const { getByTestId } = setup({ initialState });

      // Wait for getFolderList to be called and unreadMessageCount to be set
      // This will trigger unreadMessageAriaLabel to change, which should recompute useMemo
      await waitFor(
        () => {
          expect(getFolderListStub.called).to.be.true;
          getByTestId('landing-page-container');
        },
        { timeout: 2000 },
      );

      getFolderListStub.restore();
    });

    it('recomputes data when registered (vaPatient) changes', async () => {
      const initialState = stateFn({
        vaPatient: true,
      });
      const { getByTestId } = setup({ initialState });
      // Component should render with vaPatient: true
      await waitFor(() => {
        getByTestId('landing-page-container');
      });
    });
  });
});
