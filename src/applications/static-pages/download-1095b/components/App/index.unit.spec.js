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

  const generateState = ({ authenticated = false, verified = false } = {}) => ({
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
    user: {
      login: {
        currentlyLoggedIn: authenticated,
      },
      profile: {
        loa: {
          current: verified ? 3 : 1,
        },
        signIn: { serviceName: 'idme' },
      },
    },
  });

  describe('when not authenticated', () => {
    it('renders the sign-in alert', () => {
      const unauthState = generateState();
      store = mockStore(unauthState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect($('va-alert-sign-in', container)).to.exist;
      expect($('va-alert-sign-in', container).getAttribute('variant')).to.eql(
        'signInRequired',
      );
    });
  });

  describe('when not authenticated', () => {
    it('renders the verify alert', () => {
      const authState = generateState({ authenticated: true });
      store = mockStore(authState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      expect($('va-alert-sign-in', container)).to.exist;
      expect($('va-alert-sign-in', container).getAttribute('variant')).to.eql(
        'verifyIdMe',
      );
    });
  });
});
