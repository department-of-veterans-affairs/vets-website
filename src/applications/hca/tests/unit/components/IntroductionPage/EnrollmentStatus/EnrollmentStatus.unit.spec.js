import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../../../config/form';
import { HCA_ENROLLMENT_STATUSES } from '../../../../../utils/constants';
import EnrollmentStatus from '../../../../../components/IntroductionPage/EnrollmentStatus';

describe('hca <EnrollmentStatus>', () => {
  const getData = ({ hasServerError = false, statusCode = null }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          statusCode,
          hasServerError,
          applicationDate: null,
          enrollmentDate: null,
          preferredFacility: null,
          isUserInMPI: true,
          vesRecordFound: true,
          loading: false,
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

  it('should render FAQ content', () => {
    const { mockStore, props } = getData({ statusCode: 'enrolled' });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelectorAll('.hca-enrollment-faq');
    expect(selector).to.have.length;
  });

  it('should render `va-alert` with status of `error` when server error has occurred', () => {
    const { mockStore, props } = getData({ hasServerError: true });
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'error');
  });

  it('should render `va-alert` with status of `continue` when enrollment status is `enrolled`', () => {
    const { mockStore, props } = getData({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
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
      statusCode: HCA_ENROLLMENT_STATUSES.closed,
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
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
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
      statusCode: HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
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
