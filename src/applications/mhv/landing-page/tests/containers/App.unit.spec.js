import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import sinon from 'sinon';
import App from '../../containers/App';

const oldWindow = global.window;
const generateInitState = ({
  loading = false,
  mhvLandingPageEnabled = true,
  serviceName = 'idme',
  profileLoading = false,
  currentlyLoggedIn = true,
  isCernerPatient = false,
  hasFacilities = true,
}) => {
  const facilities = hasFacilities
    ? [{ facilityId: '123', isCerner: false }]
    : [];
  return {
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enabled: mhvLandingPageEnabled,
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          cernerFacilities: [
            {
              vhaId: '757',
              vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
              vamcSystemName: 'VA Central Ohio health care',
              ehr: 'cerner',
            },
          ],
        },
      },
    },
    user: {
      login: {
        currentlyLoggedIn,
      },
      profile: {
        loading: profileLoading,
        signIn: {
          serviceName,
        },
        facilities: isCernerPatient
          ? [{ facilityId: '757', isCerner: true }]
          : facilities,
      },
    },
  };
};

describe('MHV landing page', () => {
  describe('App Container', () => {
    afterEach(() => {
      global.window = oldWindow;
    });
    it('feature toggles are still loading -- should show loading indicator', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: true,
      });
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('va-loading-indicator ')).to.exist;
    });
    it('user is not loaded -- should loading indicator', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        profileLoading: true,
      });
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('va-loading-indicator ')).to.exist;
    });
    it('user is authenticated, but feature is disabled -- should not show the landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: false,
      });
      const store = mockStore(initState);
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
    it('user is authenticated with login gov and feature enabled -- should renders landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        serviceName: CSP_IDS.LOGIN_GOV,
      });
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.exist;
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });
    it('user is authenticated with idme and feature enable -- should renders landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        serviceName: CSP_IDS.ID_ME,
      });
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.exist;
      expect(container.querySelector('h1')).to.have.text('My HealtheVet');
    });
    it('user is authenticated withMHV and feature enabled -- should not show the landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        serviceName: CSP_IDS.MHV,
      });
      const store = mockStore(initState);
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
    it('user is not authenticated and feature enabled -- should not show the landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        currentlyLoggedIn: false,
      });
      const store = mockStore(initState);
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { getByRole } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(replace.called).to.be.true;
      const loading = getByRole('progressbar', {
        text: 'Redirecting to login...',
      });
      expect(loading).to.exist;
    });
    it('user is a cerner patient and feature enabled -- should not show the landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        serviceName: CSP_IDS.MHV,
        isCerner: true,
      });
      const store = mockStore(initState);
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
    it('user is authenticated with feature enabled but has no facilities -- should not show the landing page', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        mhvLandingPageEnabled: true,
        hasFacilities: false,
      });
      const store = mockStore(initState);
      const replace = sinon.spy();
      global.window.location = { ...global.window.location, replace };
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(container.querySelector('h1')).to.not.exist;
      expect(replace.called).to.be.true;
    });
  });
});
