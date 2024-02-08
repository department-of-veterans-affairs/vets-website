import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('hca IntroductionPage', () => {
  const getData = ({
    showLoader = false,
    loaState = null,
    showLoginAlert = false,
    enrollmentOverrideEnabled = false,
    applicationDate = '',
    enrollmentDate = '',
    enrollmentStatus = '',
    preferredFacility = '',
    hasESRecord = false,
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
          hcaEnrollmentStatusOverrideEnabled: enrollmentOverrideEnabled,
        },
        hcaEnrollmentStatus: {
          isLoadingApplicationStatus: showLoader,
          applicationDate,
          enrollmentDate,
          enrollmentStatus,
          preferredFacility,
          noESRRecordFound: !hasESRecord,
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
            currentlyLoggedIn: !showLoginAlert,
          },
          profile: {
            loading: showLoader,
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

  context('when the page renders', () => {
    it('should render loading indicator', () => {
      const { mockStore, props } = getData({ showLoader: true });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      expect(selector).to.exist;
    });
  });

  context('when the user is not logged in', () => {
    it('should show sign in button', () => {
      const { mockStore, props } = getData({ showLoginAlert: true });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-login-alert-button"]',
      );
      expect(selector).to.exist;
    });
  });

  context('when the user is Loa1 status', () => {
    const { mockStore, props } = getData({ loaState: 1 });

    it('should show verification required alert', () => {
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
  });

  context('when the user is not enrolled', () => {
    it('should show start application button', () => {
      const { mockStore, props } = getData({ loaState: 3 });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector('a.vads-c-action-link--green');
      expect(selector).to.exist;
    });
  });

  context('when the user is enrolled & override feature is disabled', () => {
    it('should show enrollment status', () => {
      const { mockStore, props } = getData({
        loaState: 3,
        hasESRecord: true,
        applicationDate: '2018-07-17T10:32:52.000-05:00',
        enrollmentDate: '2018-07-17T10:32:53.000-05:00',
        enrollmentStatus: 'enrolled',
        preferredFacility: '463GA - FAIRBANKS VA CLINIC',
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-enrollment-alert-heading"]',
      );
      expect(selector).to.exist;
    });
  });

  context('when the user is enrolled & override feature is enabled', () => {
    it('should show start application button', () => {
      const { mockStore, props } = getData({
        loaState: 3,
        hasESRecord: true,
        enrollmentOverrideEnabled: true,
        applicationDate: '2018-07-17T10:32:52.000-05:00',
        enrollmentDate: '2018-07-17T10:32:53.000-05:00',
        enrollmentStatus: 'enrolled',
        preferredFacility: '463GA - FAIRBANKS VA CLINIC',
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector('a.vads-c-action-link--green');
      expect(selector).to.exist;
    });
  });
});
