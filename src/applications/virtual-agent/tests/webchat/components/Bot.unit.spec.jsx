import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactReduxModule from 'react-redux';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import * as SignInModalModule from '@department-of-veterans-affairs/platform-user/SignInModal';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import * as ChatboxDisclaimerModule from '../../../chatbot/features/shell/components/RightColumnContent';
import * as AppModule from '../../../webchat/components/App';
import Bot from '../../../webchat/components/Bot';
import * as WebAuthActivityEventListenerModule from '../../../webchat/event-listeners/webAuthActivityEventListener';
import * as SessionStorageModule from '../../../webchat/utils/sessionStorage';

const mockStore = {
  getState: () => ({
    featureToggles: [
      {
        [FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection]: false,
      },
    ],
  }),
  subscribe: () => {},
  dispatch: () => ({}),
};

describe('Bot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
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
      });

      // Wait for the 2-second timeout in webAuthActivityEventListener
      await waitFor(
        () => {
          expect(getByTestId('sign-in-modal')).to.exist;
        },
        { timeout: 3000 },
      );
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
      });

      await waitFor(
        () => {
          expect(getByTestId('sign-in-modal')).to.exist;
        },
        { timeout: 3000 },
      );

      getByTestId('va-modal-close').click();
      // Wait for the auth-event-driven call ("true") and the onClose call ("false")
      await waitFor(
        () => {
          expect(setLoggedInFlowStub.callCount).to.equal(2);
        },
        { timeout: 3000 },
      );
      expect(setLoggedInFlowStub.calledWithExactly('false')).to.be.true;
    });

    it('should reopen the SignInModal after closing when auth event fires again', async () => {
      // User is not logged in, and has accepted disclaimer
      sandbox
        .stub(ReactReduxModule, 'useSelector')
        .onCall(0)
        .returns(false)
        .onCall(1)
        .returns(true);

      // In auth experience gate is satisfied
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns(true);

      // Stub SignInModal to expose a close button that triggers onClose
      sandbox.stub(SignInModalModule, 'default').callsFake(({ onClose }) => (
        <div data-testid="sign-in-modal">
          <va-button data-testid="va-modal-close" onClick={onClose}>
            Close
          </va-button>
        </div>
      ));

      const { getByTestId, queryByTestId } = render(
        <Provider store={mockStore}>
          <Bot />
        </Provider>,
      );

      // First auth event opens the modal
      await act(async () => {
        window.dispatchEvent(new Event('webchat-auth-activity'));
      });

      await waitFor(
        () => {
          expect(getByTestId('sign-in-modal')).to.exist;
        },
        { timeout: 3000 },
      );

      // Close the modal via onClose
      getByTestId('va-modal-close').click();

      // Ensure it disappears after state update
      await waitFor(
        () => {
          expect(queryByTestId('sign-in-modal')).to.not.exist;
        },
        { timeout: 3000 },
      );

      // Fire auth event again; modal should reopen
      await act(async () => {
        window.dispatchEvent(new Event('webchat-auth-activity'));
      });

      await waitFor(
        () => {
          expect(getByTestId('sign-in-modal')).to.exist;
        },
        { timeout: 3000 },
      );
    });
  });
});
