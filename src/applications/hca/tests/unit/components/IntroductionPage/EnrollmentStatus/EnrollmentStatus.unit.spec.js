import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../../../config/form';
import EnrollmentStatus from '../../../../../components/IntroductionPage/EnrollmentStatus';

describe('hca <EnrollmentStatus>', () => {
  const getData = ({
    applicationDate = null,
    enrollmentDate = null,
    preferredFacility = null,
    enrollmentStatus = null,
  }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          applicationDate,
          enrollmentDate,
          preferredFacility,
          enrollmentStatus,
          showReapplyContent: false,
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

  context('when enrollment status has not been fetched', () => {
    const { mockStore, props } = getData({});

    it('should not render any components', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatus {...props} />
        </Provider>,
      );
      expect(container).to.be.empty;
    });
  });

  context('when enrollment status has been fetched', () => {
    const { mockStore, props } = getData({
      applicationDate: '2019-04-24T00:00:00.000-06:00',
      enrollmentDate: '2019-04-30T00:00:00.000-06:00',
      enrollmentStatus: 'enrolled',
      preferredFacility: '463 - CHEY6',
    });

    it('should render `va-alert` with correct title', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatus {...props} />
        </Provider>,
      );
      const selectors = {
        alert: container.querySelector('va-alert'),
        headline: container.querySelector(
          '[data-testid="hca-enrollment-alert-heading"]',
        ),
      };
      expect(selectors.alert).to.exist;
      expect(selectors.alert).to.have.attr('status', 'warning');
      expect(selectors.headline).to.contain.text(
        'You’re already enrolled in VA health care',
      );
    });

    it('should render FAQ content', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <EnrollmentStatus {...props} />
        </Provider>,
      );
      const selector = container.querySelector('h3');
      expect(container).to.not.be.empty;
      expect(selector).to.exist;
    });
  });
});
