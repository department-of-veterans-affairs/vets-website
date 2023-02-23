import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import sinon from 'sinon';
import App from '../App';

const oldWindow = global.window;
const generateInitState = ({
  loading = false,
  mhvLandingPageEnabled = true,
  serviceName = 'idme',
  profileLoading = false,
}) => {
  return {
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enabled: mhvLandingPageEnabled,
    },
    user: {
      profile: {
        loading: profileLoading,
        signIn: {
          serviceName,
        },
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
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(getByTestId('loading-indicator')).to.exist;
    });
    it('user is not loaded -- should loading indicator', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: false,
        profileLoading: true,
      });
      const store = mockStore(initState);
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(getByTestId('loading-indicator')).to.exist;
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
      const wrapper = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(wrapper.queryByTestId('landing-page-container')).to.not.exist;
      expect(replace.called).to.be.true;
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
      const wrapper = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(wrapper.queryByTestId('landing-page-container')).to.not.exist;
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
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(getByTestId('landing-page-container')).to.exist;
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
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect(getByTestId('landing-page-container')).to.exist;
    });
  });
});
