import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

describe('HCA IntroductionPage', () => {
  const getData = ({
    showLoader,
    loaState,
    showLoginAlert,
    enrollmentOverrideEnabled,
    applicationDate = '',
    enrollmentDate = '',
    enrollmentStatus = '',
    preferredFacility = '',
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

  it('should render and show loading message', () => {
    const { mockStore, props } = getData({
      showLoader: true,
      loaState: 1,
      showLoginAlert: true,
      enrollmentOverrideEnabled: false,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(view.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should show verification required alert for Loa1 logged in user', () => {
    const { mockStore, props } = getData({
      showLoader: false,
      loaState: 1,
      showLoginAlert: false,
      enrollmentOverrideEnabled: false,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(view.container).to.contain.text(
      'VA health care covers care for your physical and mental health.',
    );
    expect(
      view.container.querySelector('[data-testid="identity-alert-heading"]'),
    ).to.contain.text(
      'Please verify your identity before applying for VA health care',
    );
  });

  it('should show enrollment status for Loa3 user that is already enrolled and feature toggle to override enrollment status is disabled', () => {
    const { mockStore, props } = getData({
      showLoader: false,
      loaState: 3,
      showLoginAlert: false,
      enrollmentOverrideEnabled: false,
      applicationDate: '2018-07-17T10:32:52.000-05:00',
      enrollmentDate: '2018-07-17T10:32:53.000-05:00',
      enrollmentStatus: 'enrolled',
      preferredFacility: '463GA - FAIRBANKS VA CLINIC',
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(
      view.container.querySelector('[data-testid="enrollment-alert-heading"]'),
    ).to.contain.text('You’re already enrolled in VA health care');
  });

  it('should show sign in to start your application for Loa3 user that is not logged in and not already enrolled', () => {
    const { mockStore, props } = getData({
      showLoader: false,
      loaState: 3,
      showLoginAlert: true,
      enrollmentOverrideEnabled: true,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(
      view.container.querySelector('[data-testid="login-alert-button"]'),
    ).to.have.attribute('text', 'Sign in to check your application status');
  });

  it('should show start your application for Loa3 user that is logged in and not already enrolled', () => {
    const { mockStore, props } = getData({
      showLoader: false,
      loaState: 3,
      showLoginAlert: false,
      enrollmentOverrideEnabled: true,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(view.container.querySelector('.usa-button-primary')).to.contain.text(
      'Start the health care application',
    );
  });
});
