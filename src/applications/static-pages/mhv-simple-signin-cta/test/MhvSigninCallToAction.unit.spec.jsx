import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { MhvSimpleSigninCallToAction } from '../index';

describe('MHV Signin CTA', () => {
  describe('render widget', () => {
    const mockStore = configureStore([]);
    const serviceDescription = 'order supplies';
    const linkText = 'order medical supplies';

    it('unanthenticated user', async () => {
      const { container, queryByTestId, getByText } = render(
        <Provider store={mockStore()}>
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
      const { container, queryByTestId, getByText } = render(
        <Provider store={mockStore()}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified={false}
            serviceName={CSP_IDS.ID_ME}
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
      const { container, queryByTestId } = render(
        <Provider store={mockStore()}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified
            serviceName={CSP_IDS.ID_ME}
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
      const { getByTestId } = render(
        <Provider store={mockStore()}>
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
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
          <MhvSimpleSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
            mhvAccountLoading={false}
            profileLoading
          />
        </Provider>,
      );
      getByTestId('mhv-signin-widget-loading');
    });
  });
});
