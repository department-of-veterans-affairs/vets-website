import { renderHook, act } from '@testing-library/react-hooks';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import * as GenesysServiceModule from '../../../chatbot/features/messaging/GenesysService';
import { useMessaging } from '../../../chatbot/features/messaging/useMessaging';
import chatbotReducer, {
  selectConnectionStatus,
  selectMessages,
  selectErrorMessage,
  selectIsAgentTyping,
} from '../../../chatbot/store/chatbotSlice';

function buildStore() {
  return configureStore({ reducer: { chatbot: chatbotReducer } });
}

function buildWrapper(store) {
  // eslint-disable-next-line react/display-name
  // eslint-disable-next-line react/prop-types
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

function buildMockService() {
  return {
    init: sinon.stub().resolves(),
    startConversation: sinon.stub().resolves(),
    fetchHistory: sinon.stub().resolves(),
    sendMessage: sinon.stub().resolves(),
    destroy: sinon.stub(),
    _storedCallbacks: null,
  };
}

const TEST_CONFIG = { deploymentId: 'test-id', region: 'test-region' };

describe('useMessaging', () => {
  let sandbox;
  let mockService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    GenesysServiceModule.GenesysService.resetInstance();
    mockService = buildMockService();

    mockService.init = sinon.stub().callsFake(callbacks => {
      mockService._storedCallbacks = callbacks;
      return Promise.resolve();
    });

    sandbox
      .stub(GenesysServiceModule.GenesysService, 'getInstance')
      .returns(mockService);
  });

  afterEach(() => {
    GenesysServiceModule.GenesysService.resetInstance();
    sandbox.restore();
  });

  describe('initialisation', () => {
    it('calls GenesysService.getInstance and init on mount', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      expect(GenesysServiceModule.GenesysService.getInstance.calledOnce).to.be
        .true;
      expect(mockService.init.calledOnce).to.be.true;
    });

    it('calls service.destroy on unmount', async () => {
      const store = buildStore();

      const { unmount } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});
      unmount();

      expect(mockService.destroy.calledOnce).to.be.true;
    });
  });

  describe('startConversation', () => {
    it('dispatches setConnectionStatus("connecting") and calls service.startConversation', async () => {
      const store = buildStore();

      const { result } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        result.current.startConversation();
      });

      expect(selectConnectionStatus(store.getState())).to.equal('connecting');
      expect(mockService.startConversation.calledOnce).to.be.true;
    });

    it('restores active conversation when start returns already active error', async () => {
      const store = buildStore();
      mockService.startConversation = sinon
        .stub()
        .rejects(new Error('There is already an active conversation'));

      const { result } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      await act(async () => {
        result.current.startConversation();
        await Promise.resolve();
      });

      expect(mockService.fetchHistory.calledOnce).to.be.true;
      expect(selectConnectionStatus(store.getState())).to.equal('connected');
      expect(selectErrorMessage(store.getState())).to.be.null;
    });
  });

  describe('sendMessage', () => {
    it('optimistically adds a user message and calls service.sendMessage', async () => {
      const store = buildStore();

      const { result } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        result.current.sendMessage('Hello there');
      });

      const messages = selectMessages(store.getState());
      expect(messages).to.have.lengthOf(1);
      expect(messages[0].sender).to.equal('user');
      expect(messages[0].text).to.equal('Hello there');
      expect(mockService.sendMessage.calledOnce).to.be.true;
      expect(mockService.sendMessage.firstCall.args[0]).to.equal('Hello there');
    });

    it('does nothing for empty or whitespace-only text', async () => {
      const store = buildStore();

      const { result } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        result.current.sendMessage('   ');
      });

      expect(selectMessages(store.getState())).to.have.lengthOf(0);
      expect(mockService.sendMessage.called).to.be.false;
    });
  });

  describe('service callbacks to Redux state', () => {
    it('adds incoming VA messages from onMessagesReceived', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      const inboundMessage = {
        id: 'bot-msg-1',
        sender: 'va',
        text: 'How can I help?',
        timestamp: Date.now(),
      };

      act(() => {
        mockService._storedCallbacks.onMessagesReceived([inboundMessage]);
      });

      const messages = selectMessages(store.getState());
      expect(messages).to.have.lengthOf(1);
      expect(messages[0]).to.deep.equal(inboundMessage);
    });

    it('filters echoed outbound user message that matches a pending optimistic send', async () => {
      const store = buildStore();

      const { result } = renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        result.current.sendMessage('Echo me');
      });

      act(() => {
        mockService._storedCallbacks.onMessagesReceived([
          {
            id: 'genesys-echo-1',
            sender: 'user',
            text: 'Echo me',
            timestamp: Date.now() + 10,
          },
        ]);
      });

      const messages = selectMessages(store.getState());
      expect(messages).to.have.lengthOf(1);
      expect(messages[0].text).to.equal('Echo me');
    });

    it('sets connected status on onStarted when not read-only', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onStarted({ readOnly: false });
      });

      expect(selectConnectionStatus(store.getState())).to.equal('connected');
    });

    it('sets disconnected status on onStarted when read-only', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onStarted({ readOnly: true });
      });

      expect(selectConnectionStatus(store.getState())).to.equal('disconnected');
    });

    it('updates connection status on onConnectionStatus callback', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onConnectionStatus('reconnecting');
      });

      expect(selectConnectionStatus(store.getState())).to.equal('reconnecting');
    });

    it('updates typing state from onTypingIndicator', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onTypingIndicator(true);
      });

      expect(selectIsAgentTyping(store.getState())).to.equal(true);
    });

    it('sets error state from onError callback', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onError('Connection refused');
      });

      expect(selectErrorMessage(store.getState())).to.equal(
        'Connection refused',
      );
      expect(selectConnectionStatus(store.getState())).to.equal('error');
    });

    it('sets disconnected and clears typing on onDisconnected callback', async () => {
      const store = buildStore();

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      act(() => {
        mockService._storedCallbacks.onTypingIndicator(true);
        mockService._storedCallbacks.onDisconnected();
      });

      expect(selectConnectionStatus(store.getState())).to.equal('disconnected');
      expect(selectIsAgentTyping(store.getState())).to.equal(false);
    });
  });

  describe('when init rejects', () => {
    it('dispatches setError with the rejection message', async () => {
      const store = buildStore();
      mockService.init = sinon.stub().rejects(new Error('SDK not loaded'));

      renderHook(() => useMessaging(TEST_CONFIG), {
        wrapper: buildWrapper(store),
      });

      await act(async () => {});

      expect(selectErrorMessage(store.getState())).to.equal('SDK not loaded');
    });
  });
});
