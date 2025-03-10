import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';
import formConfig from '../../../../../config/form';
import ProcessDescription from '../../../../../components/IntroductionPage/GetStarted/ProcessDescription';

describe('hca <ProcessDescription>', () => {
  const subject = ({
    dispatch = () => {},
    savedForms = [],
    loggedIn = true,
  } = {}) => {
    const props = {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    };
    const mockStore = {
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
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessDescription {...props} />
      </Provider>,
    );
    const selectors = () => ({
      checkStatusAlert: container.querySelector(
        '[data-testid="hca-check-status-alert"]',
      ),
      hiddenItems: container.querySelectorAll('.vads-u-display--none'),
      loginBtn: container.querySelector(
        '[data-testid="hca-login-alert-button"]',
      ),
      saveTimeAlert: container.querySelector(
        '[data-testid="hca-save-time-alert"]',
      ),
      startBtn: container.querySelectorAll('.vads-c-action-link--green'),
    });
    return { selectors };
  };

  it('should render login alerts when user is logged out', () => {
    const { selectors } = subject({ loggedIn: false });
    const { checkStatusAlert, saveTimeAlert } = selectors();
    expect(saveTimeAlert).to.exist;
    expect(checkStatusAlert).to.exist;
  });

  it('should render `Start` buttons when user is logged in', () => {
    const { selectors } = subject();
    expect(selectors().startBtn).to.have.lengthOf(2);
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
    const { selectors } = subject({ savedForms });
    expect(selectors().hiddenItems).to.have.lengthOf(2);
  });

  it('should call the `toggleLoginModal` action when user attempts to sign in', () => {
    const dispatchStub = sinon.stub();
    const { selectors } = subject({ loggedIn: false, dispatch: dispatchStub });
    const { loginBtn } = selectors();

    fireEvent.click(loginBtn);
    expect(dispatchStub.calledWithMatch(toggleLoginModal(true))).to.be.true;
  });
});
