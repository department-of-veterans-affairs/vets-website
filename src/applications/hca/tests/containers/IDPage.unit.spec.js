import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import IDPage from '../../containers/IDPage';

describe('hca IDPage', () => {
  const defaultProps = {
    hcaEnrollmentStatus: {
      enrollmentStatus: '',
      isLoading: false,
      isUserInMVI: false,
      loginRequired: false,
      noESRRecordFound: false,
      hasServerError: false,
      isLoadingApplicationStatus: false,
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        loading: false,
      },
    },
  };

  describe('when redux is loading data', () => {
    const props = {
      ...defaultProps,
      user: {
        ...defaultProps.user,
        profile: { loading: true },
      },
    };
    const store = {
      getState: () => props,
      subscribe: () => {},
      dispatch: () => {},
    };
    it('should render only the page title & loading indicator', () => {
      const { container } = render(
        <Provider store={store}>
          <IDPage />
        </Provider>,
      );
      const selectors = {
        title: container.querySelector('[data-testid="form-title"]'),
        form: container.querySelector('.rjsf'),
        loader: container.querySelector('va-loading-indicator'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(
        'Before you start your application',
      );
      expect(selectors.loader).to.exist;
      expect(selectors.loader).to.have.attr(
        'message',
        'Loading your application...',
      );
      expect(selectors.form).to.not.exist;
    });
  });

  describe('when redux is populated with data', () => {
    const store = {
      getState: () => ({ ...defaultProps }),
      subscribe: () => {},
      dispatch: () => {},
    };
    it('should show the sign in button and ID verification form', () => {
      const { container } = render(
        <Provider store={store}>
          <IDPage />
        </Provider>,
      );
      const selectors = {
        form: container.querySelector('.rjsf'),
        loader: container.querySelector('va-loading-indicator'),
        buttons: {
          login: container.querySelector('[data-testid="idform-login-button"]'),
          submit: container.querySelector('.idform-submit-button'),
        },
      };
      expect(selectors.loader).to.not.exist;
      expect(selectors.form).to.exist;
      expect(selectors.buttons.login).to.exist;
      expect(selectors.buttons.login).to.contain.text(
        'Sign in to start your application.',
      );
      expect(selectors.buttons.submit).to.exist;
      expect(selectors.buttons.submit).to.contain.text(
        'Continue to the application',
      );
    });
  });

  describe('when the form is submitted', () => {
    const props = {
      ...defaultProps,
      hcaEnrollmentStatus: {
        isLoadingApplicationStatus: true,
      },
    };
    const store = {
      getState: () => props,
      subscribe: () => {},
      dispatch: () => {},
    };
    it('should show the loading indicator', () => {
      const { container } = render(
        <Provider store={store}>
          <IDPage />
        </Provider>,
      );
      const selectors = {
        alert: container.querySelector('va-alert'),
        submit: container.querySelector('.idform-submit-button'),
        loader: container.querySelector('va-loading-indicator'),
      };
      expect(selectors.alert).to.not.exist;
      expect(selectors.submit).to.not.exist;
      expect(selectors.loader).to.exist;
      expect(selectors.loader).to.have.attr(
        'message',
        'Reviewing your information...',
      );
    });
  });

  describe('when the form is submitted and login is required', () => {
    const props = {
      ...defaultProps,
      hcaEnrollmentStatus: {
        loginRequired: true,
      },
    };
    const store = {
      getState: () => props,
      subscribe: () => {},
      dispatch: () => {},
    };
    it('should show the login required alert', () => {
      const { container } = render(
        <Provider store={store}>
          <IDPage />
        </Provider>,
      );
      const selectors = {
        alert: container.querySelector('va-alert'),
        submit: container.querySelector('.idform-submit-button'),
        loader: container.querySelector('va-loading-indicator'),
      };
      expect(selectors.loader).to.not.exist;
      expect(selectors.submit).to.not.exist;
      expect(selectors.alert).to.exist;
      expect(selectors.alert).to.contain.text(
        'Please sign in to review your information',
      );
    });
  });

  describe('when the form is submitted and receives a server error', () => {
    const props = {
      ...defaultProps,
      hcaEnrollmentStatus: {
        hasServerError: true,
      },
    };
    const store = {
      getState: () => props,
      subscribe: () => {},
      dispatch: () => {},
    };
    it('should show the server error alert', () => {
      const { container } = render(
        <Provider store={store}>
          <IDPage />
        </Provider>,
      );
      const selectors = {
        alert: container.querySelector('va-alert'),
        loader: container.querySelector('va-loading-indicator'),
      };
      expect(selectors.loader).to.not.exist;
      expect(selectors.alert).to.exist;
      expect(selectors.alert).to.contain.text(
        'Something went wrong on our end',
      );
    });
  });
});
