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

  context('when the component renders', () => {
    it(`should render FAQ content`, () => {
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
  });

  context('when user is permitted to apply to benefits', () => {
    it('should render the `apply` link', () => {
      const { mockStore, props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusFAQ {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Apply for VA health care');
    });

    it('should render the `get started` content when `showReapplyContent` is true', () => {
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
  });

  context('when is permitted to reapply for benefits', () => {
    it('should render the `reapply` link', () => {
      const { mockStore, props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingUnverified,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusFAQ {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Reapply for VA health care');
    });

    it('should render the `get started` content when `showReapplyContent` is true', () => {
      const { mockStore, props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
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
  });

  context('when user is not permitted to apply/reapply for benefits', () => {
    it('should not render the `reapply` link', () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusFAQ {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.not.exist;
    });

    it('should not render the `get started` content', () => {
      const { mockStore, props } = getData({ showReapplyContent: true });
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatusFAQ {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.hca-sip-intro');
      expect(selector).to.not.exist;
    });
  });
});
