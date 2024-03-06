import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../../../../config/form';
import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import EnrollmentStatusFAQ from '../../../../../../components/IntroductionPage/EnrollmentStatus/FAQ';

describe('hca <EnrollmentStatusFAQ>', () => {
  const getData = ({
    enrollmentStatus = HCA_ENROLLMENT_STATUSES.enrolled,
    showReapplyContent = false,
  }) => ({
    props: {
      enrollmentStatus,
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          enrollmentStatus,
          showReapplyContent,
          isUserInMVI: true,
          loginRequired: false,
          noESRRecordFound: false,
          hasServerError: false,
          isLoadingApplicationStatus: false,
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
          login: { currentlyLoggedIn: true },
          profile: {
            loading: false,
            verified: true,
            loa: { current: 3 },
            savedForms: [],
            prefillsAvailable: [formConfig.formId],
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

  it(`should render FAQ content when the component renders`, () => {
    const { mockStore, props } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatusFAQ {...props} />
      </Provider>,
    );
    const selector = container.querySelector('h3');
    expect(container).to.not.be.empty;
    expect(selector).to.exist;
  });

  it('should render the `get started` content when `showReapplyContent` is `true`', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
      showReapplyContent: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatusFAQ {...props} />
      </Provider>,
    );
    const selectors = {
      processList: container.querySelector('va-process-list'),
      sipInfo: container.querySelector('.hca-sip-intro'),
      ombInfo: container.querySelector('va-omb-info'),
    };

    expect(selectors.processList).to.exist;
    expect(selectors.sipInfo).to.exist;
    expect(selectors.ombInfo).to.exist;
  });

  it('should not render the `get started` content when `showReapplyContent` is `false`', () => {
    const { mockStore, props } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatusFAQ {...props} />
      </Provider>,
    );
    const selector = container.querySelector('.hca-sip-intro');
    expect(selector).to.not.exist;
  });
});
