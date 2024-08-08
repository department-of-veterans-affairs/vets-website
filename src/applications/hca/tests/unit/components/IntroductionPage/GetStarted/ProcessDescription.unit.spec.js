import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import formConfig from '../../../../../config/form';
import ProcessDescription from '../../../../../components/IntroductionPage/GetStarted/ProcessDescription';

describe('hca <ProcessDescription>', () => {
  const getData = ({
    dispatch = () => {},
    savedForms = [],
    loggedIn = true,
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
          vesRecordFound: false,
          hasServerError: false,
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
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: false,
            verified: true,
            loa: { current: loggedIn ? 3 : null },
            savedForms,
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
      dispatch,
    },
  });

  it('should render login alerts when user is logged out', () => {
    const { mockStore, props } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessDescription {...props} />
      </Provider>,
    );
    const alerts = {
      saveTime: container.querySelector('[data-testid="hca-save-time-alert"]'),
      checkStatus: container.querySelector(
        '[data-testid="hca-check-status-alert"]',
      ),
    };
    expect(alerts.saveTime).to.exist;
    expect(alerts.checkStatus).to.exist;
  });

  it('should render `Start` buttons when user is logged in', () => {
    const { mockStore, props } = getData({});
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessDescription {...props} />
      </Provider>,
    );
    const selector = container.querySelectorAll('.vads-c-action-link--green');
    expect(selector).to.have.lengthOf(2);
  });

  it('should hide static content when user has form in progress', () => {
    const savedForms = [
      {
        form: VA_FORM_IDS.FORM_10_10EZ,
        metadata: {
          version: 8,
          returnUrl: '/',
          submission: {},
          savedAt: 1710448997474,
          createdAt: 1710448997,
          expiresAt: 1715632997,
          lastUpdated: 1710448997,
          inProgressFormId: 1234,
        },
        lastUpdated: 1710448997,
      },
    ];
    const { mockStore, props } = getData({ savedForms });
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessDescription {...props} />
      </Provider>,
    );
    const selector = container.querySelectorAll('.vads-u-display--none');
    expect(selector).to.have.lengthOf(2);
  });

  it('should call the `toggleLoginModal` action when user attempts to sign in', () => {
    const dispatch = sinon.stub();
    const { mockStore, props } = getData({ loggedIn: false, dispatch });
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessDescription {...props} />
      </Provider>,
    );
    const selector = container.querySelector(
      '[data-testid="hca-login-alert-button"]',
    );

    fireEvent.click(selector);
    expect(dispatch.called).to.be.true;
    expect(dispatch.calledWithMatch(toggleLoginModal(true))).to.be.true;
  });
});
