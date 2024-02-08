import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import IdentityVerificationForm from '../../../../components/IdentityPage/VerificationForm';

describe('hca <IdentityVerificationForm>', () => {
  const getData = ({
    loginRequired = false,
    hasServerError = false,
    isLoadingApplicationStatus = false,
  }) => ({
    props: {
      data: {},
      onLogin: () => {},
      onChange: () => {},
      onSubmit: () => {},
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          loginRequired,
          hasServerError,
          isLoadingApplicationStatus,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the component renders', () => {
    const { mockStore, props } = getData({});

    it('should render the submit button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.hca-idform-submit-button');
      expect(selector).to.exist;
    });

    it('should not render the loading indicator or any alerts', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selectors = {
        alerts: container.querySelector('va-alert'),
        loader: container.querySelector('.hca-idform-submit-loader'),
      };
      expect(selectors.alerts).to.not.exist;
      expect(selectors.loader).to.not.exist;
    });
  });

  context('when the form has been submitted', () => {
    const { mockStore, props } = getData({ isLoadingApplicationStatus: true });

    it('should render the loading indicator', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.hca-idform-submit-loader');
      expect(selector).to.exist;
    });

    it('should not render the submit button or any alerts', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selectors = {
        alerts: container.querySelector('va-alert'),
        submitBtn: container.querySelector('.hca-idform-submit-button'),
      };
      expect(selectors.alerts).to.not.exist;
      expect(selectors.submitBtn).to.not.exist;
    });
  });

  context('when login is required after form submission', () => {
    const { mockStore, props } = getData({ loginRequired: true });

    it('should render the login required alert', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-idform-login-alert"]',
      );
      expect(selector).to.exist;
    });

    it('should not render the loading indicator or submit button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm />
        </Provider>,
      );
      const selectors = {
        loader: container.querySelector('.hca-idform-submit-loader'),
        submitBtn: container.querySelector('.hca-idform-submit-button'),
      };
      expect(selectors.loader).to.not.exist;
      expect(selectors.submitBtn).to.not.exist;
    });
  });

  context('when server error has occurred during form submission', () => {
    const { mockStore, props } = getData({ hasServerError: true });

    it('should render the server error alert', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-server-error-alert"]',
      );
      expect(selector).to.exist;
    });

    it('should not render the loading indicator', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityVerificationForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.hca-idform-submit-loader');
      expect(selector).to.not.exist;
    });
  });
});
