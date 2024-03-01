import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import formConfig from '../../../../../config/form';
import GetStartedContent from '../../../../../components/IntroductionPage/GetStarted';

describe('hca <GetStartedContent>', () => {
  const getData = ({ showLoginAlert = true }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
      showLoginAlert,
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          showReapplyContent: false,
          isUserInMVI: true,
          loginRequired: false,
          noESRRecordFound: true,
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
      dispatch: sinon.stub(),
    },
  });

  context('when the component renders', () => {
    const { mockStore, props } = getData({});

    it('should render the static content', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selectors = {
        processList: container.querySelector('va-process-list'),
        ombInfo: container.querySelector('va-omb-info'),
      };
      expect(selectors.processList).to.exist;
      expect(selectors.ombInfo).to.exist;
    });
  });

  context('when the user is logged out', () => {
    const { mockStore, props } = getData({});

    it('should render the correct number of login boxes', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selector = container.querySelectorAll('va-alert, va-summary-box');
      expect(selector).to.have.lengthOf(2);
    });

    it('should render `Sign In` button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-login-alert-button"]',
      );
      expect(selector).to.exist;
    });
  });

  context('when the user is logged in', () => {
    const { mockStore, props } = getData({ showLoginAlert: false });

    it('should not render login alerts', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selector = container.querySelectorAll('va-alert');

      // selector should only have 1 single <va-alert> element
      // with text "...signed in..."
      expect(selector).to.have.lengthOf(1);
      expect(selector[0].textContent).to.contain('signed in');
    });

    it('should render the correct number of `Start Application` buttons', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selector = container.querySelectorAll('.vads-c-action-link--green');
      expect(selector).to.have.lengthOf(2);
    });
  });

  context('when user attempts to sign in', () => {
    const { mockStore, props } = getData({});

    it('should call the `toggleLoginModal` action', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <GetStartedContent {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-login-alert-button"]',
      );

      fireEvent.click(selector);
      expect(mockStore.dispatch.called).to.be.true;
      expect(mockStore.dispatch.calledWith(toggleLoginModal(true))).to.be.true;
    });
  });
});
