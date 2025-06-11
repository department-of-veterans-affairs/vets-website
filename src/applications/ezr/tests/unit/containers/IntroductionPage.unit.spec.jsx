import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import content from '../../../locales/en/content.json';
import IntroductionPage from '../../../containers/IntroductionPage';

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
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selectors = {
        title: container.querySelector('[data-testid="form-title"]'),
        sipInfo: container.querySelector('[data-testid="ezr-login-alert"]'),
        ombInfo: container.querySelector('va-omb-info'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.sipInfo).to.exist;
      expect(selectors.ombInfo).to.exist;
    });

    it('should not render the identity verification alert', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="ezr-identity-alert"]',
      );
      expect(selector).to.not.exist;
    });

    it('should not render the start form button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
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
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selectors = {
        title: container.querySelector('[data-testid="form-title"]'),
        sipInfo: container.querySelector('[data-testid="ezr-identity-alert"]'),
        ombInfo: container.querySelector('va-omb-info'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.sipInfo).to.exist;
      expect(selectors.ombInfo).to.exist;
    });

    it('should not render the login alert', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="ezr-login-alert"]',
      );
      expect(selector).to.not.exist;
    });

    it('should not render the start form button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
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
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        expect(selector).to.exist;
        expect(selector).to.contain.attr(
          'message',
          content['load-enrollment-status'],
        );
      });

      it('should not render page content, start button or OMB info', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
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
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selectors = {
          title: container.querySelector('[data-testid="form-title"]'),
          sipInfo: container.querySelector(
            '[data-testid="ezr-enrollment-status-alert"]',
          ),
          ombInfo: container.querySelector('va-omb-info'),
        };
        expect(selectors.title).to.exist;
        expect(selectors.sipInfo).to.exist;
        expect(selectors.ombInfo).to.exist;
      });

      it('should not render `va-loading-indicator`', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        expect(selector).to.not.exist;
      });
    });
  });
});
