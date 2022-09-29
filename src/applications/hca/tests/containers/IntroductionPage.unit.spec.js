import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

describe('HCA IntroductionPage', () => {
  const getData = ({
    showMainLoader,
    loaState,
    showLoginAlert,
    hcaEnrollmentStatusOverrideEnabled,
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
          // eslint-disable-next-line camelcase
          hca_enrollment_status_override_enabled: hcaEnrollmentStatusOverrideEnabled,
        },
        hcaEnrollmentStatus: {
          isLoadingApplicationStatus: showMainLoader,
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
            loading: showMainLoader,
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
      showMainLoader: true,
      loaState: 1,
      showLoginAlert: true,
      hcaEnrollmentStatusOverrideEnabled: false,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-loading-indicator', view.container)).to.exist;
  });

  it('should show verification required alert for Loa1 logged in user', () => {
    const { mockStore, props } = getData({
      showMainLoader: false,
      loaState: 1,
      showLoginAlert: false,
      hcaEnrollmentStatusOverrideEnabled: false,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(view.container.textContent).to.contain(
      'VA health care covers care for your physical and mental health.',
    );
    expect($('h4', view.container).textContent).to.contain(
      'Please verify your identity before applying for VA health care',
    );
  });

  it('should show enrollment status for Loa3 user that is already enrolled and feature toggle to override enrollment status is disabled', () => {
    const { mockStore, props } = getData({
      showMainLoader: false,
      loaState: 3,
      showLoginAlert: false,
      hcaEnrollmentStatusOverrideEnabled: false,
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

    expect($('h2', view.container).textContent).to.contain(
      'You’re already enrolled in VA health care',
    );
  });

  it('should show sign in to start your applicatin for Loa3 user that is not logged in and not already enrolled', () => {
    const { mockStore, props } = getData({
      showMainLoader: false,
      loaState: 3,
      showLoginAlert: true,
      hcaEnrollmentStatusOverrideEnabled: true,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect($('va-button', view.container)).to.have.attribute(
      'text',
      'Sign in to check your application status',
    );
  });

  it('should show start your applicatin for Loa3 user that is logged in and not already enrolled', () => {
    const { mockStore, props } = getData({
      showMainLoader: false,
      loaState: 3,
      showLoginAlert: false,
      hcaEnrollmentStatusOverrideEnabled: true,
    });
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect($('button', view.container).textContent).to.contain(
      'Start the health care application',
    );
  });
});
