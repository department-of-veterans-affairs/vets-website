import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from './index';

const mockStore = configureStore([]);

describe('App component', () => {
  let store;

  const unauthenticatedState = {
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        loa: {
          current: null,
        },
      },
    },
  };
  const unverifiedState = {
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        loa: {
          current: 1,
        },
        signIn: {
          serviceName: null,
        },
      },
    },
  };

  describe('when not authenticated', () => {
    it('renders the sign-in alert', () => {
      store = mockStore(unauthenticatedState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect($('va-button', container).outerHTML).to.contain(
        'Sign in or create an account',
      );
    });
  });
  describe('when not authenticated', () => {
    describe('when using ID.me', () => {
      it('renders the sign-in alert', () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'idme';
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        expect($('.idme-verify-button', container).outerHTML).to.exist;
      });
    });
    describe('when using Login.gov', () => {
      it('renders the sign-in alert', () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'logingov';
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        expect($('.logingov-verify-button', container).outerHTML).to.exist;
      });
    });
    describe('when not using ID.me or Login.gov', () => {
      it('renders the sign-in alert', () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'mhv';
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        expect($('.logingov-verify-button', container).outerHTML).to.exist;
        expect($('.idme-verify-button', container).outerHTML).to.exist;
      });
    });
  });
});
