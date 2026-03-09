/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { chatbotActions } from '../../store';
import { GenesysService } from './GenesysService';

/** @typedef {import('../../../types/common.d').GenesysConfig} GenesysConfig */

/**
 * Bridges GenesysService ↔ Redux store.
 *
 * Initialises the Genesys SDK on mount, wires service callbacks to Redux
 * dispatch calls, and exposes stable action methods to the UI layer.
 *
 * The service is initialised exactly once per mount (empty dependency array).
 * ESLint warns about missing deps for `config` and `dispatch`:
 *   - `dispatch` is guaranteed stable by react-redux.
 *   - `config` is a module-level constant, never changes at runtime.
 * So the empty array is intentional.
 *
 * @param {GenesysConfig} config - Genesys deployment configuration
 * @returns {{ startConversation: function(): void, sendMessage: function(string): void, clearConversation: function(): void }}
 */
export function useMessaging(config) {
  const dispatch = useDispatch();
  const pendingOutgoingMessagesRef = useRef([]);

  const isActiveConversationError = error => {
    const message = (error && error.message) || '';
    return (
      typeof message === 'string' &&
      message.toLowerCase().includes('already an active conversation')
    );
  };

  useEffect(() => {
    const service = GenesysService.getInstance(config);

    service
      .init({
        onMessagesReceived: messages => {
          const now = Date.now();
          const filteredMessages = messages.filter(message => {
            if (message.sender !== 'user') return true;

            const index = pendingOutgoingMessagesRef.current.findIndex(
              pending =>
                pending.text === message.text &&
                now - pending.timestamp < 30000,
            );

            if (index < 0) return true;
            pendingOutgoingMessagesRef.current.splice(index, 1);
            return false;
          });

          if (!filteredMessages.length) return;
          dispatch(chatbotActions.addMessages(filteredMessages));
        },
        onRestored: messages => {
          dispatch(chatbotActions.acceptDisclaimer());
          dispatch(chatbotActions.setConnectionStatus('connected'));
          if (messages && messages.length) {
            dispatch(chatbotActions.addMessages(messages));
          }
        },
        onStarted: event => {
          const isReadOnly = !!(event && event.readOnly);
          dispatch(
            chatbotActions.setConnectionStatus(
              isReadOnly ? 'disconnected' : 'connected',
            ),
          );
        },
        onError: errorMessage => {
          dispatch(chatbotActions.setError(errorMessage));
        },
        onDisconnected: () => {
          dispatch(chatbotActions.setConnectionStatus('disconnected'));
          dispatch(chatbotActions.setAgentTyping(false));
        },
        onTypingIndicator: isTyping => {
          dispatch(chatbotActions.setAgentTyping(isTyping));
        },
        onConnectionStatus: status => {
          dispatch(chatbotActions.setConnectionStatus(status));
        },
      })
      .catch(err => {
        dispatch(
          chatbotActions.setError(err.message || 'Failed to initialise chat'),
        );
      });

    return () => {
      service.destroy();
    };
  }, []); // intentionally empty — service initialises once on mount

  const startConversation = useCallback(() => {
    dispatch(chatbotActions.setConnectionStatus('connecting'));

    const service = GenesysService.getInstance(config);
    service.startConversation().catch(err => {
      if (isActiveConversationError(err)) {
        dispatch(chatbotActions.setConnectionStatus('connected'));
        service.fetchHistory().catch(historyErr => {
          dispatch(
            chatbotActions.setError(
              historyErr.message || 'Failed to restore conversation',
            ),
          );
        });
        return;
      }

      dispatch(
        chatbotActions.setError(err.message || 'Failed to start conversation'),
      );
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(text => {
    if (!text || !text.trim()) return;
    const normalizedText = text.trim();

    /** @type {import('../../../types/common.d').ChatMessage} */
    const optimisticMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: normalizedText,
      timestamp: Date.now(),
    };

    pendingOutgoingMessagesRef.current.push({
      text: normalizedText,
      timestamp: optimisticMessage.timestamp,
    });

    dispatch(chatbotActions.addMessage(optimisticMessage));

    const service = GenesysService.getInstance(config);
    service.sendMessage(normalizedText).catch(err => {
      dispatch(
        chatbotActions.setError(err.message || 'Failed to send message'),
      );
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearConversation = useCallback(() => {
    const service = GenesysService.getInstance(config);
    service.clearConversation().then(
      () => {
        pendingOutgoingMessagesRef.current = [];
        dispatch(chatbotActions.resetChat());
        dispatch(chatbotActions.acceptDisclaimer());
        dispatch(chatbotActions.setConnectionStatus('connected'));
      },
      err => {
        dispatch(
          chatbotActions.setError(
            err.message || 'Failed to clear conversation',
          ),
        );
      },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { startConversation, sendMessage, clearConversation };
}

export default useMessaging;
