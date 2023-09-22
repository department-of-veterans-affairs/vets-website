import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

describe('hca IntroductionPage', () => {
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

  describe('when the page renders', () => {
    it('should render loading indicator', () => {
      const { mockStore, props } = getData({
        showLoader: true,
        loaState: 1,
        showLoginAlert: true,
        enrollmentOverrideEnabled: false,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      expect(selector).to.exist;
      expect(selector).to.have.attr('message', 'Loading your application...');
    });
  });

  describe('when the the user is not logged in', () => {
    it('should show sign in button', () => {
      const { mockStore, props } = getData({
        showLoader: false,
        loaState: 3,
        showLoginAlert: true,
        enrollmentOverrideEnabled: true,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-login-alert-button"]',
      );
      expect(selector).to.have.attr(
        'text',
        'Sign in to check your application status',
      );
    });
  });

  describe('when the the user is logged in', () => {
    describe('when the user is Loa1 status', () => {
      it('should show verification required alert & description', () => {
        const { mockStore, props } = getData({
          showLoader: false,
          loaState: 1,
          showLoginAlert: false,
          enrollmentOverrideEnabled: false,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selectors = {
          alert: container.querySelector('[data-testid="hca-identity-alert"]'),
          description: container.querySelector(
            '[data-testid="hca-loa1-description"]',
          ),
        };
        expect(selectors.alert).to.exist;
        expect(selectors.description).to.exist;
      });
    });

    describe('when the user is Loa3 status', () => {
      describe('when the user is not enrolled', () => {
        it('should show start application button', () => {
          const { mockStore, props } = getData({
            showLoader: false,
            loaState: 3,
            showLoginAlert: false,
            enrollmentOverrideEnabled: true,
          });
          const { container } = render(
            <Provider store={mockStore}>
              <IntroductionPage {...props} />
            </Provider>,
          );
          const selector = container.querySelector(
            'a.vads-c-action-link--green',
          );
          expect(selector).to.exist;
          expect(selector).to.contain.text('Start the health care application');
        });
      });

      describe('when the user is enrolled', () => {
        describe('when the override feature toggle is disabled', () => {
          it('should show enrollment status', () => {
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
            const { container } = render(
              <Provider store={mockStore}>
                <IntroductionPage {...props} />
              </Provider>,
            );
            const selector = container.querySelector(
              '[data-testid="hca-enrollment-alert-heading"]',
            );
            expect(selector).to.exist;
            expect(selector).to.contain.text(
              'You’re already enrolled in VA health care',
            );
          });
        });

        describe('when the override feature toggle is enabled', () => {
          it('should show start application button', () => {
            const { mockStore, props } = getData({
              showLoader: false,
              loaState: 3,
              showLoginAlert: false,
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
            const selector = container.querySelector(
              'a.vads-c-action-link--green',
            );
            expect(selector).to.exist;
            expect(selector).to.contain.text(
              'Start the health care application',
            );
          });
        });
      });
    });
  });
});
