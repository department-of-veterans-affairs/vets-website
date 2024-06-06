import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import * as ReactReduxModule from 'react-redux';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as SignInModalModule from '@department-of-veterans-affairs/platform-user/SignInModal';

import * as SessionStorageModule from '../../utils/sessionStorage';
import * as WebAuthActivityEventListenerModule from '../../event-listeners/webAuthActivityEventListener';
import * as ChatboxDisclaimerModule from '../../components/ChatboxDisclaimer';
import * as AppModule from '../../components/App';
import Bot from '../../components/Bot';

const mockStore = {
  getState: () => ({
    featureToggles: [
      {
        [FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection]: false,
        [FEATURE_FLAG_NAMES.virtualAgentEnableMsftPvaTesting]: false,
        [FEATURE_FLAG_NAMES.virtualAgentEnableNluPvaTesting]: false,
      },
    ],
  }),
  subscribe: () => {},
  dispatch: () => ({}),
};

describe('Bot', () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    // Even though we don't use clearTimeout, setInterval, and clearInterval,
    // if we don't fake them, the tests will hang after they're complete. -.-
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('Bot', () => {
    it('should setup the webAuthActivityEventListener', () => {
      sandbox.stub(ReactReduxModule, 'useSelector');
      const webAuthActivityEventListenerStub = sandbox.stub(
        WebAuthActivityEventListenerModule,
        'default',
      );
      render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );
      expect(webAuthActivityEventListenerStub.calledOnce).to.be.true;
    });
    it('should set inAuthexp to true and loggedInFlow to false if user is logged in', () => {
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(0)
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getLoggedInFlow').returns('true');
      const setInAuthExpStub = sandbox.stub(
        SessionStorageModule,
        'setInAuthExp',
      );
      const setLoggedInFlowStub = sandbox.stub(
        SessionStorageModule,
        'setLoggedInFlow',
      );
      render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );
      expect(setInAuthExpStub.calledOnce).to.be.true;
      expect(setInAuthExpStub.calledWithExactly('true')).to.be.true;
      expect(setLoggedInFlowStub.calledOnce).to.be.true;
      expect(setLoggedInFlowStub.calledWithExactly('false')).to.be.true;
    });
    it('should return ChatboxDisclaimer if disclaimer use has not accepted disclaimer', () => {
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(1)
        .returns(false);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns(false);
      sandbox
        .stub(ChatboxDisclaimerModule, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      const { getByTestId } = render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );
      expect(getByTestId('disclaimer')).to.exist;
    });
    it('should return the SignInModal if user is not logged in and is in an auth experience', async () => {
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(0)
        .returns(false)
        .onCall(1)
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns(true);
      sandbox
        .stub(SignInModalModule, 'default')
        .callsFake(() => <div data-testid="sign-in-modal" />);

      const { getByTestId } = render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );

      await act(async () => {
        window.dispatchEvent(new Event('webchat-auth-activity'));
        clock.tick(10000);
      });

      expect(getByTestId('sign-in-modal')).to.exist;
    });
    it('should return the App if user accepts disclaimer and does not need to sign in', () => {
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(0)
        .returns(true)
        .onCall(1)
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns(true);
      sandbox.stub(SessionStorageModule, 'getLoggedInFlow').returns('false');
      sandbox.stub(React, 'useState').returns([true, sandbox.stub()]);
      sandbox
        .stub(AppModule, 'default')
        .callsFake(() => <div data-testid="app" />);
      const { getByTestId } = render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );
      expect(getByTestId('app')).to.exist;
    });
    it('should call setLoggedInFlow when signInModal is closed', async () => {
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(0)
        .returns(false)
        .onCall(1)
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns(true);
      const setLoggedInFlowStub = sandbox
        .stub(SessionStorageModule, 'setLoggedInFlow')
        .returns(true);
      sandbox.stub(SignInModalModule, 'default').callsFake(({ onClose }) => (
        <div data-testid="sign-in-modal">
          <va-button data-testid="va-modal-close" onClick={onClose}>
            Close
          </va-button>
        </div>
      ));

      const { getByTestId } = render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );

      await act(async () => {
        window.dispatchEvent(new Event('webchat-auth-activity'));
        clock.tick(2000);
      });

      getByTestId('va-modal-close').click();
      expect(setLoggedInFlowStub.calledTwice).to.be.true;
      expect(setLoggedInFlowStub.calledWithExactly('false')).to.be.true;
    });
  });
});
