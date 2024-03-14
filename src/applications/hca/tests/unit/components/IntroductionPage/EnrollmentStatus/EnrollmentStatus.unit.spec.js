import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../../../config/form';
import { HCA_ENROLLMENT_STATUSES } from '../../../../../utils/constants';
import EnrollmentStatus from '../../../../../components/IntroductionPage/EnrollmentStatus';

describe('hca <EnrollmentStatus>', () => {
  const getData = ({ enrollmentStatus = null }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          enrollmentStatus,
          applicationDate: null,
          enrollmentDate: null,
          preferredFacility: null,
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

  it('should not render any content when enrollment status has not been fetched', () => {
    const { mockStore, props } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    expect(container).to.be.empty;
  });

  it('should render FAQ content when enrollment status has been fetched', () => {
    const { mockStore, props } = getData({ enrollmentStatus: 'enrolled' });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelectorAll('.hca-enrollment-faq');
    expect(selector).to.have.length;
  });

  it('should render `va-alert` with status of `continue` when enrollment status is `enrolled`', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'continue');
  });

  it('should render `va-alert` with status of `warning` when enrollment status is not `enrolled`', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.closed,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'warning');
  });

  it('should not render `Start` button when enrollment status is not in the allow list', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelector('[href="#start"]');
    expect(selector).to.not.exist;
  });

  it('should render `Start` button when enrollment status is in the allow list', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelector('[href="#start"]');
    expect(selector).to.exist;
  });
});
