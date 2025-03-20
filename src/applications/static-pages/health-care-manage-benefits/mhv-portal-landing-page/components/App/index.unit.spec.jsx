import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { App, linkText, mapStateToProps } from './index';

describe('MHV Portal Landing Page', () => {
  describe('map state properties', () => {
    it('user not logged in', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: false,
          },
          profile: {
            loa: {
              current: null,
            },
            loading: false,
            mhvAccount: {
              loading: false,
            },
          },
        },
      };
      const result = mapStateToProps(state);
      expect(result.userIsLoggedIn).to.eql(false);
      expect(result.profileLoading).to.eql(false);
      expect(result.mhvAccountLoading).to.eql(false);
    });

    it('user logged in', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            loa: {
              current: 3,
            },
            loading: true,
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
            mhvAccount: {
              loading: true,
            },
          },
        },
      };
      const result = mapStateToProps(state);
      expect(result.userIsLoggedIn).to.eql(true);
      expect(result.serviceName).to.eql(CSP_IDS.ID_ME);
      expect(result.userIsVerified).to.eql(true);
      expect(result.profileLoading).to.eql(true);
      expect(result.mhvAccountLoading).to.eql(true);
    });
  });

  describe('<App>', () => {
    const mockStore = configureStore([]);

    it('renders unanthenticated user', async () => {
      const { container, queryByTestId } = render(
        <Provider store={mockStore()}>
          <App userIsLoggedIn={false} />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.exist;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('renders unverified user', async () => {
      const { container, queryByTestId } = render(
        <Provider store={mockStore()}>
          <App
            userIsLoggedIn
            userIsVerified={false}
            serviceName={CSP_IDS.ID_ME}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.exist;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .not.exist;
    });

    it('renders CTA-link for verified user', async () => {
      const { container, queryByTestId } = render(
        <Provider store={mockStore()}>
          <App userIsLoggedIn userIsVerified serviceName={CSP_IDS.ID_ME} />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(container.querySelector(`va-link-action[text="${linkText}"]`)).to
        .exist;
    });

    it('renders mhvAccount is loading indicator', () => {
      const { getByTestId } = render(
        <Provider store={mockStore()}>
          <App
            userIsLoggedIn
            userIsVerified
            serviceName={CSP_IDS.ID_ME}
            mhvAccountLoading
            profileLoading={false}
          />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });

    it('renders profile is loading indicator', () => {
      const { getByTestId } = render(
        <Provider store={mockStore()}>
          <App
            userIsLoggedIn
            userIsVerified
            serviceName={CSP_IDS.ID_ME}
            mhvAccountLoading={false}
            profileLoading
          />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });
  });
});
