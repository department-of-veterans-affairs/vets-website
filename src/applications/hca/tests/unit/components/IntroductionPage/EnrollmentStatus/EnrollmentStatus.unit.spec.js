import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../../../config/form';
import { HCA_ENROLLMENT_STATUSES } from '../../../../../utils/constants';
import EnrollmentStatus from '../../../../../components/IntroductionPage/EnrollmentStatus';

describe('hca <EnrollmentStatus>', () => {
  const subject = ({ hasServerError = false, statusCode = null } = {}) => {
    const props = {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    };
    const mockStore = {
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
    };
    const { container } = render(
      <Provider store={mockStore}>
        <EnrollmentStatus {...props} />
      </Provider>,
    );
    const selectors = () => ({
      faqItems: container.querySelectorAll('.hca-enrollment-faq'),
      startBtn: container.querySelector('[href="#start"]'),
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors };
  };

  it('should render FAQ content', () => {
    const { selectors } = subject({ statusCode: 'enrolled' });
    expect(selectors().faqItems).to.have.length;
  });

  it('should render `va-alert` with status of `error` when server error has occurred', () => {
    const { selectors } = subject({ hasServerError: true });
    const { vaAlert } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'error');
  });

  it('should render `va-alert` with status of `continue` when enrollment status is `enrolled`', () => {
    const { selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
    });
    const { vaAlert } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'continue');
  });

  it('should render `va-alert` with status of `warning` when enrollment status is not `enrolled`', () => {
    const { selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.closed,
    });
    const { vaAlert } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'warning');
  });

  it('should not render `Start` button when enrollment status is not in the allow list', () => {
    const { selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
    });
    expect(selectors().startBtn).to.not.exist;
  });

  it('should render `Start` button when enrollment status is in the allow list', () => {
    const { selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
    });
    expect(selectors().startBtn).to.exist;
  });
});
