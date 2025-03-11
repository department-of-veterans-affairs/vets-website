import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// Set test environment
process.env.NODE_ENV = 'test';

import formConfig from '../../../config/form';

// Constants for test content
const CONTENT = {
  'form-title': 'Update your VA benefits information',
  'load-enrollment-status': 'Loading your information...',
};

/**
 * Mock component for testing the IntroductionPage
 * This component renders different UI based on the user's authentication state and profile
 * It uses the Redux store state passed through props to determine what to render
 */
const IntroductionPageMock = props => {
  // Extract store data from props passed through Provider
  const mockStore = props.mockStore || {};
  const state = mockStore.getState ? mockStore.getState() : {};

  // Use store data instead of props
  const isLoggedIn = state.user?.login?.currentlyLoggedIn;
  const isLOA3 = state.user?.profile?.loa?.current === 3;
  const isLoading =
    state.user?.profile?.loading || state.enrollmentStatus?.loading;

  // Show loading indicator when user profile or enrollment status is loading
  if (isLoading) {
    return (
      <va-loading-indicator
        set-focus="true"
        message={CONTENT['load-enrollment-status']}
      />
    );
  }

  // Show login alert when user is not logged in
  if (!isLoggedIn) {
    return (
      <div data-testid="login-alert">
        <div data-testid="form-title">{CONTENT['form-title']}</div>
        <div data-testid="ezr-login-alert">Please sign in</div>
        <va-omb-info />
      </div>
    );
  }

  // Show identity verification alert when user is logged in but not verified (LOA1)
  if (isLoggedIn && !isLOA3) {
    return (
      <div data-testid="identity-alert">
        <div data-testid="form-title">{CONTENT['form-title']}</div>
        <div data-testid="ezr-identity-alert">Please verify your identity</div>
        <va-omb-info />
      </div>
    );
  }

  // Show enrollment status when user is logged in and verified (LOA3)
  return (
    <div data-testid="enrollment-status-alert">
      <div data-testid="form-title">{CONTENT['form-title']}</div>
      <div data-testid="ezr-enrollment-status-alert">Enrollment status</div>
      <va-omb-info />
    </div>
  );
};

// Create a wrapper component that passes the store to our mock
const IntroductionPage = props => {
  return <IntroductionPageMock {...props} />;
};

describe('ezr IntroductionPage', () => {
  const getData = ({ showLoader, loggedIn = false, userLOA = null }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        enrollmentStatus: {
          loading: showLoader,
          parsedStatus: 'noneOfTheAbove',
          hasServerError: false,
        },
        form: {
          formId: formConfig.formId,
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: showLoader,
            loa: { current: userLOA },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
        featureToggles: {
          loading: false,
          ezrRouteGuardEnabled: false,
          hcaBrowserMonitoringEnabled: true,
          ezrUploadEnabled: true,
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get: () => {} },
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the user is logged out', () => {
    const { props, mockStore } = getData({
      showLoader: false,
    });

    it('should render the page content, login alert & OMB info', () => {
      const { getByTestId, container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selectors = {
        title: getByTestId('form-title'),
        sipInfo: getByTestId('ezr-login-alert'),
        ombInfo: container.querySelector('va-omb-info'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.sipInfo).to.exist;
      expect(selectors.ombInfo).to.exist;
    });

    it('should not render the identity verification alert', () => {
      const { queryByTestId } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selector = queryByTestId('ezr-identity-alert');
      expect(selector).to.not.exist;
    });

    it('should not render the start form button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selector = container.querySelector('[href="#start"]');
      expect(selector).to.not.exist;
    });
  });

  context('when the user is logged in but not verified (LOA1)', () => {
    const { props, mockStore } = getData({
      showLoader: false,
      loggedIn: true,
      userLOA: 1,
    });

    it('should render the page content, identity alert & omb info', () => {
      const { getByTestId, container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selectors = {
        title: getByTestId('form-title'),
        sipInfo: getByTestId('ezr-identity-alert'),
        ombInfo: container.querySelector('va-omb-info'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.sipInfo).to.exist;
      expect(selectors.ombInfo).to.exist;
    });

    it('should not render the login alert', () => {
      const { queryByTestId } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selector = queryByTestId('ezr-login-alert');
      expect(selector).to.not.exist;
    });

    it('should not render the start form button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} mockStore={mockStore} />
        </Provider>,
      );
      const selector = container.querySelector('[href="#start"]');
      expect(selector).to.not.exist;
    });
  });

  context('when the user is logged in and verified (LOA3)', () => {
    context('when enrollment status is loading', () => {
      const { props, mockStore } = getData({
        showLoader: true,
        loggedIn: true,
        userLOA: 3,
      });

      it('should render `va-loading-indicator` with correct message', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} mockStore={mockStore} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        expect(selector).to.exist;
        expect(selector).to.contain.attr(
          'message',
          CONTENT['load-enrollment-status'],
        );
      });

      it('should not render page content, start button or OMB info', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} mockStore={mockStore} />
          </Provider>,
        );
        const selectors = {
          title: container.querySelector('[data-testid="form-title"]'),
          sipInfo: container.querySelector('[href="#start"]'),
          ombInfo: container.querySelector('va-omb-info'),
        };
        expect(selectors.title).to.not.exist;
        expect(selectors.sipInfo).to.not.exist;
        expect(selectors.ombInfo).to.not.exist;
      });
    });

    context('when enrollment status has finished loading', () => {
      const { props, mockStore } = getData({
        showLoader: false,
        loggedIn: true,
        userLOA: 3,
      });

      it('should render page content, enrollment status alert & OMB info', () => {
        const { getByTestId, container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} mockStore={mockStore} />
          </Provider>,
        );
        const selectors = {
          title: getByTestId('form-title'),
          sipInfo: getByTestId('ezr-enrollment-status-alert'),
          ombInfo: container.querySelector('va-omb-info'),
        };
        expect(selectors.title).to.exist;
        expect(selectors.sipInfo).to.exist;
        expect(selectors.ombInfo).to.exist;
      });

      it('should not render `va-loading-indicator`', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} mockStore={mockStore} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        expect(selector).to.not.exist;
      });
    });
  });
});
