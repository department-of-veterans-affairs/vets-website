import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import EnrollmentStatusWarning from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning';
import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';

describe('hca <EnrollmentStatusWarning>', () => {
  const getData = ({
    enrollmentStatus = HCA_ENROLLMENT_STATUSES.enrolled,
    showReapplyContent = false,
    dispatch = () => {},
  }) => ({
    props: {
      applicationDate: '2019-04-24T12:00:00.000-00:00',
      enrollmentDate: '2019-04-30T12:00:00.000-00:00',
      preferredFacility: '463 - CHEY6',
      enrollmentStatus,
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
      dispatch,
    },
  });

  context('when the component renders', () => {
    const { mockStore, props } = getData({});

    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('status', 'warning');
    });

    it('should not render reapply button when enrollment status is not on the allow list', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('status', 'warning');
    });
  });

  context('when enrollment status is not on the allowed list', () => {
    const { mockStore, props } = getData({});

    it('should not render reapply button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-reapply-button"]',
      );
      expect(selector).to.not.exist;
    });
  });

  context('when enrollment status allows Veteran to `Apply`', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
    });

    it('should not render reapply button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-reapply-button"]',
      );
      expect(selector).to.exist;
      expect(selector).to.have.attr('text', 'Apply for VA health care');
    });
  });

  context('when enrollment status allows Veteran to `Reapply`', () => {
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.canceledDeclined,
    });

    it('should not render reapply button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-reapply-button"]',
      );
      expect(selector).to.exist;
      expect(selector).to.have.attr('text', 'Reapply for VA health care');
    });
  });

  context('when reapply button is clicked', () => {
    const dispatch = sinon.stub();
    const { mockStore, props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.canceledDeclined,
      dispatch,
    });

    it('should not render reapply button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusWarning {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-reapply-button"]',
      );
      fireEvent.click(selector);
      expect(dispatch.called).to.be.true;
    });
  });
});
