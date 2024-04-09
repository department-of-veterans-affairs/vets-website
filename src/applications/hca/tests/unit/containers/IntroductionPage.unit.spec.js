import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('hca IntroductionPage', () => {
  const getData = ({
    isLoading = false,
    loaState = 3,
    loggedIn = true,
    hasError = false,
    hasESRecord = false,
    overrideEnabled = false,
    statusCode = null,
  } = {}) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          hca_enrollment_status_override_enabled: overrideEnabled,
        },
        hcaEnrollmentStatus: {
          loading: isLoading,
          hasServerError: hasError,
          vesRecordFound: hasESRecord,
          statusCode,
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
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
            loa: { current: loaState },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: {
            get: () => {},
          },
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render `va-loading-indicator` when enrollment status is loading', () => {
    const { mockStore, props } = getData({ isLoading: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-loading-indicator');
    expect(selector).to.exist;
  });

  it('should show identity verification alert when the user is LOA1 status', () => {
    const { mockStore, props } = getData({ loaState: 1 });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = container.querySelector(
      '[data-testid="hca-identity-alert"]',
    );
    expect(selector).to.exist;
  });

  it('should show process description when no enrollment record exists', () => {
    const { mockStore, props } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-process-list');
    expect(selector).to.exist;
  });

  it('should show process description when override is enabled', () => {
    const { mockStore, props } = getData({
      hasESRecord: true,
      overrideEnabled: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-process-list');
    expect(selector).to.exist;
  });

  it('should show process description when user is logged out', () => {
    const { mockStore, props } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = {
      list: container.querySelector('va-process-list'),
      ombInfo: container.querySelector('va-omb-info'),
    };
    expect(selectors.list).to.exist;
    expect(selectors.ombInfo).to.exist;
  });

  it('should show enrollment status alert when record exists', () => {
    const { mockStore, props } = getData({ hasESRecord: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = container.querySelector(
      '[data-testid="hca-enrollment-alert"]',
    );
    expect(selector).to.exist;
  });

  it('should show server error alert when error occurs', () => {
    const { mockStore, props } = getData({ hasError: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = {
      alert: container.querySelector('[data-testid="hca-server-error-alert"]'),
      ombInfo: container.querySelector('va-omb-info'),
    };
    expect(selectors.alert).to.exist;
    expect(selectors.ombInfo).to.not.exist;
  });
});
