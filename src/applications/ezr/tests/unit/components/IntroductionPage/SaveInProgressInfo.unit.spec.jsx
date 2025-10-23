import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import content from '../../../../locales/en/content.json';
import SaveInProgressInfo from '../../../../components/IntroductionPage/SaveInProgressInfo';

describe('ezr <SaveInProgressInfo>', () => {
  const getData = ({
    loggedIn,
    loaState,
    showLoader,
    enrollmentStatus = 'noneOfTheAbove',
    hasServerError = false,
    canSubmitFinancialInfo = false,
    preferredFacility = '463 - CHEY6',
  }) => ({
    props: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
    mockStore: {
      getState: () => ({
        enrollmentStatus: {
          loading: showLoader,
          parsedStatus: enrollmentStatus,
          hasServerError,
          preferredFacility,
          canSubmitFinancialInfo,
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
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: showLoader,
            verified: loggedIn,
            loa: { current: loaState },
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

  describe('when the component renders', () => {
    context('when the user is not logged in', () => {
      it('should render `va-alert` with `sign in` button', () => {
        const { props, mockStore } = getData({
          showLoader: false,
          loggedIn: false,
          loaState: null,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <SaveInProgressInfo {...props} />
          </Provider>,
        );
        const selectors = {
          alert: container.querySelector('[data-testid="ezr-login-alert"]'),
          button: container.querySelector('va-button'),
        };
        expect(selectors.alert).to.exist;
        expect(selectors.button).to.exist;
        expect(selectors.button.outerHTML).to.contain(
          content['sip-sign-in-to-start-text'],
        );
      });
    });

    context('when the user is logged in', () => {
      context('when the user has not submitted financials', () => {
        it('should render `va-alert` with `start` button', () => {
          const { props, mockStore } = getData({
            showLoader: false,
            loggedIn: true,
            loaState: 3,
            enrollmentStatus: 'enrolled',
            canSubmitFinancialInfo: true,
          });
          const { container } = render(
            <Provider store={mockStore}>
              <SaveInProgressInfo {...props} />
            </Provider>,
          );
          const selectors = {
            alert: container.querySelector(
              '[data-testid="ezr-financial-status-warning"]',
            ),
            button: container.querySelector('.vads-c-action-link--green'),
          };
          expect(selectors.alert).to.not.exist;
          expect(selectors.button).to.exist;
          expect(selectors.button).to.contain.text(
            content['sip-start-form-text'],
          );
        });
      });

      context('when the user already has submitted financials', () => {
        it('should render `va-alert` with `start` button', () => {
          const { props, mockStore } = getData({
            showLoader: false,
            loggedIn: true,
            loaState: 3,
            enrollmentStatus: 'enrolled',
            canSubmitFinancialInfo: false,
          });
          const { container } = render(
            <Provider store={mockStore}>
              <SaveInProgressInfo {...props} />
            </Provider>,
          );
          const selectors = {
            alert: container.querySelector(
              '[data-testid="ezr-financial-status-warning"]',
            ),
          };
          expect(selectors.alert).to.exist;
        });
      });

      context('when the user is not enrolled in benefits', () => {
        it('should render `va-alert` with `apply` button', () => {
          const { props, mockStore } = getData({
            showLoader: false,
            loggedIn: true,
            loaState: 3,
          });
          const { container } = render(
            <Provider store={mockStore}>
              <SaveInProgressInfo {...props} />
            </Provider>,
          );
          const selectors = {
            alert: container.querySelector(
              '[data-testid="ezr-enrollment-status-alert"]',
            ),
            button: container.querySelector('.vads-c-action-link--green'),
          };
          expect(selectors.alert).to.exist;
          expect(selectors.button).to.exist;
          expect(selectors.button).to.contain.text(
            content['alert-enrollment-action'],
          );
        });
      });

      context('when an error has occurred fetching enrollment status', () => {
        it('should render `va-alert` with `error` status', () => {
          const { props, mockStore } = getData({
            showLoader: false,
            loggedIn: true,
            loaState: 3,
            hasServerError: true,
          });
          const { container } = render(
            <Provider store={mockStore}>
              <SaveInProgressInfo {...props} />
            </Provider>,
          );
          const selector = container.querySelector('va-alert');
          expect(selector).to.exist;
          expect(selector).to.have.attr('status', 'error');
          expect(selector).to.contain.text(content['alert-server-title']);
        });
      });

      context('when the user has a preferred facility on file', () => {
        it('should not render preferred facility alert', () => {
          const { props, mockStore } = getData({
            showLoader: false,
            loggedIn: true,
            loaState: 3,
            enrollmentStatus: 'enrolled',
          });
          const { container } = render(
            <Provider store={mockStore}>
              <SaveInProgressInfo {...props} />
            </Provider>,
          );
          const selector = container.querySelector(
            '[data-testid="ezr-preferred-facility-alert"]',
          );
          expect(selector).to.not.exist;
        });
      });

      context(
        'when the user does not have a preferred facility on file',
        () => {
          it('should render preferred facility alert', () => {
            const { props, mockStore } = getData({
              showLoader: false,
              loggedIn: true,
              loaState: 3,
              enrollmentStatus: 'enrolled',
              preferredFacility: null,
            });
            const { container } = render(
              <Provider store={mockStore}>
                <SaveInProgressInfo {...props} />
              </Provider>,
            );
            const selector = container.querySelector(
              '[data-testid="ezr-preferred-facility-alert"]',
            );
            expect(selector).to.exist;
            expect(selector).to.have.attr('status', 'error');
          });
        },
      );
    });
  });
});
