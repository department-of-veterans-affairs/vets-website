import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MhvSimpleSigninCallToAction } from '../index';

describe('MHV Signin CTA', () => {
  describe('render widget', () => {
    const mockStore = configureStore([]);
    const serviceDescription = 'order supplies';
    const linkText = 'order medical supplies';

    it('unanthenticated user', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: false },
          profile: {
            loading: false,
            mhvAccount: { loading: false },
            loa: { current: 0 },
          },
        },
      };
      const { container, queryByTestId, getByText } = render(
        <Provider store={mockStore(initialState)}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.exist;
      expect(getByText(RegExp(serviceDescription))).to.exist;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('unverified user', async () => {
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
      const { container, queryByTestId, getByText } = render(
        <Provider store={mockStore(initialState)}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.exist;
      expect(getByText(RegExp(serviceDescription))).to.exist;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('verified user', async () => {
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
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            linkText={linkText}
            linkUrl="/health-care/order-medical-supplies/"
          />
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
          login: { currentlyLoggedIn: false },
          profile: {
            loading: false,
            mhvAccount: { loading: true },
            loa: { current: 0 },
          },
          signIn: {
            serviceName: null,
          },
        },
      };
      const { getByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
          />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });

    it('renders profile is loading indicator', () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: false },
          profile: {
            loading: true,
            mhvAccount: { loading: false },
            loa: { current: 0 },
          },
          signIn: {
            serviceName: null,
          },
        },
      };
      const { getByTestId } = render(
        <Provider store={mockStore(initialState)}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
          />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });
  });
});
