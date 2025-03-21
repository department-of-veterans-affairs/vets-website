import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { App, linkText } from './index';

describe('MHV Portal Landing Page', () => {
  describe('<App>', () => {
    const mockStore = configureStore([]);

    it('renders unanthenticated user', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: false },
          profile: {
            loading: false,
            mhvAccount: { loading: false },
            loa: { current: 1 },
          },
          signIn: {
            serviceName: 'idme',
          },
        },
      };
      const { container, queryByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <App />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.exist;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('renders unverified user', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            loading: false,
            mhvAccount: { loading: false },
            loa: { current: 1 },
          },
          signIn: {
            serviceName: 'idme',
          },
        },
      };
      const { container, queryByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <App />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.exist;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('renders CTA-link for verified user', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            loading: false,
            mhvAccount: { loading: false },
            loa: { current: 3 },
          },
          signIn: {
            serviceName: 'idme',
          },
        },
      };
      const { container, queryByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <App />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .exist;
    });

    it('renders mhvAccount is loading indicator', () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            loading: false,
            mhvAccount: { loading: true },
            loa: { current: 3 },
          },
          signIn: {
            serviceName: 'idme',
          },
        },
      };
      const { getByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <App />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });

    it('renders profile is loading indicator', () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            loading: true,
            mhvAccount: { loading: false },
            loa: { current: 3 },
          },
          signIn: {
            serviceName: 'idme',
          },
        },
      };
      const { getByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <App />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });
  });
});
