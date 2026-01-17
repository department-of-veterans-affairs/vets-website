import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { COMPLETE, ERROR, LOADING } from '../../utils/loadingStatus';
import * as UseWebChatModule from '../../hooks/useWebChat';
import * as ChatbotErrorModule from '../../components/ChatbotError';
import * as WebChatModule from '../../components/WebChat';
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as ExpiryModule from '../../utils/expiry';
import App from '../../components/App';

describe('App', () => {
  let sandbox;
  let clock;

  const createStoreWithPersistence = (persist = true) => {
    const initialState = {
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled]: persist,
      },
    };
    return createStore((state = initialState) => state);
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers({
      toFake: ['setInterval', 'clearInterval', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('App', () => {
    it('should render the ChatbotError component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: ERROR });
      sandbox
        .stub(ChatbotErrorModule, 'default')
        .returns(<div data-testid="chatbot-error" />);

      const store = createStoreWithPersistence(true);
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(getByTestId('chatbot-error')).to.exist;
    });
    it('should render the va-loading-indicator component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: LOADING });

      const store = createStoreWithPersistence(true);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect($('va-loading-indicator', container)).to.exist;
    });
    it('should render the WebChat component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: COMPLETE });
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      const store = createStoreWithPersistence(true);
      const { getByTestId } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(getByTestId('webchat-module')).to.exist;
    });
    it('should throw an error when loadingStatus is unknown', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: 'OTHER' });

      const store = createStoreWithPersistence(true);
      // Wrap App in Provider so hooks using react-redux have context
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );
      const { result } = renderHook(() => App({}), { wrapper });

      expect(result.error?.message).to.equal('Invalid loading status: OTHER');
    });
    it('should show the chat-ended alert when the token expiry threshold is reached', () => {
      const expiresAt = ExpiryModule.EXPIRY_ALERT_BUFFER_MS + 1000;

      sandbox
        .stub(SessionStorageModule, 'getTokenExpiresAt')
        .returns(expiresAt);
      sandbox.stub(UseWebChatModule, 'default').returns({
        token: 'fake-token',
        code: undefined,
        expired: false,
        webChatFramework: {},
        loadingStatus: COMPLETE,
      });
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      const store = createStoreWithPersistence(true);
      const { queryByText, getByText } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(queryByText('Chat ended')).to.be.null;

      act(() => {
        // Advance fake timers by the polling interval so the expiry check runs
        clock.tick(5000);
      });

      expect(getByText('Chat ended')).to.exist;
    });
    it('should not show the chat-ended alert when persistence toggle is disabled', () => {
      const expiresAt = ExpiryModule.EXPIRY_ALERT_BUFFER_MS + 1000;

      sandbox
        .stub(SessionStorageModule, 'getTokenExpiresAt')
        .returns(expiresAt);
      sandbox.stub(UseWebChatModule, 'default').returns({
        token: 'fake-token',
        code: undefined,
        expired: true,
        webChatFramework: {},
        loadingStatus: COMPLETE,
      });
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      const store = createStoreWithPersistence(false);
      const { queryByText } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(queryByText('Chat ended')).to.be.null;

      act(() => {
        clock.tick(5000);
      });

      expect(queryByText('Chat ended')).to.be.null;
    });
    it('should hide the chat-ended alert when starting a new chat', () => {
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      sandbox.stub(UseWebChatModule, 'default').returns({
        token: 'fake-token',
        code: undefined,
        expired: true,
        webChatFramework: {},
        loadingStatus: COMPLETE,
      });

      const store = createStoreWithPersistence(true);
      const { container, getByText, queryByText } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(getByText('Chat ended')).to.exist;

      const button = container.querySelector(
        'va-button[text="Start new chat"]',
      );

      expect(button).to.exist;

      act(() => {
        fireEvent.click(button);
      });

      expect(queryByText('Chat ended')).to.be.null;
    });
  });
});
