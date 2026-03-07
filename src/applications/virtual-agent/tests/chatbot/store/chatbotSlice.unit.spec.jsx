import { expect } from 'chai';

import chatbotReducer, {
  chatbotActions,
  selectChatbotHasAcceptedDisclaimer,
  selectConnectionStatus,
  selectErrorMessage,
  selectIsAgentTyping,
  selectIsConnected,
  selectMessages,
} from '../../../chatbot/store/chatbotSlice';

const initialState = {
  hasAcceptedDisclaimer: false,
  connectionStatus: 'idle',
  messages: [],
  errorMessage: null,
  isAgentTyping: false,
};

describe('chatbotSlice', () => {
  describe('initial state', () => {
    it('returns the initial state when state is undefined', () => {
      const state = chatbotReducer(undefined, { type: 'UNKNOWN' });

      expect(state).to.deep.equal(initialState);
    });
  });

  describe('acceptDisclaimer', () => {
    it('sets hasAcceptedDisclaimer to true', () => {
      const state = chatbotReducer(
        undefined,
        chatbotActions.acceptDisclaimer(),
      );

      expect(state.hasAcceptedDisclaimer).to.equal(true);
    });
  });

  describe('setConnectionStatus', () => {
    it('updates connectionStatus', () => {
      const state = chatbotReducer(
        undefined,
        chatbotActions.setConnectionStatus('connecting'),
      );

      expect(state.connectionStatus).to.equal('connecting');
    });

    it('clears errorMessage when status becomes connected', () => {
      const withError = {
        ...initialState,
        errorMessage: 'Something went wrong',
        connectionStatus: 'error',
      };
      const state = chatbotReducer(
        withError,
        chatbotActions.setConnectionStatus('connected'),
      );

      expect(state.connectionStatus).to.equal('connected');
      expect(state.errorMessage).to.be.null;
    });

    it('does not clear errorMessage for other statuses', () => {
      const withError = {
        ...initialState,
        errorMessage: 'Something went wrong',
        connectionStatus: 'connected',
      };
      const state = chatbotReducer(
        withError,
        chatbotActions.setConnectionStatus('disconnected'),
      );

      expect(state.errorMessage).to.equal('Something went wrong');
    });
  });

  describe('addMessage', () => {
    it('appends a message to the messages array', () => {
      const message = {
        id: 'msg-1',
        sender: 'va',
        text: 'Hello!',
        timestamp: 1,
      };
      const state = chatbotReducer(
        undefined,
        chatbotActions.addMessage(message),
      );

      expect(state.messages).to.have.lengthOf(1);
      expect(state.messages[0]).to.deep.equal(message);
    });

    it('preserves existing messages when adding new ones', () => {
      const first = { id: 'msg-1', sender: 'va', text: 'Hi', timestamp: 1 };
      const second = {
        id: 'msg-2',
        sender: 'user',
        text: 'Hello',
        timestamp: 2,
      };

      let state = chatbotReducer(undefined, chatbotActions.addMessage(first));
      state = chatbotReducer(state, chatbotActions.addMessage(second));

      expect(state.messages).to.have.lengthOf(2);
      expect(state.messages[1]).to.deep.equal(second);
    });

    it('updates existing message when id already exists', () => {
      const first = { id: 'msg-1', sender: 'va', text: 'Old', timestamp: 1 };
      const updated = {
        id: 'msg-1',
        sender: 'va',
        text: 'Updated',
        timestamp: 2,
      };

      let state = chatbotReducer(undefined, chatbotActions.addMessage(first));
      state = chatbotReducer(state, chatbotActions.addMessage(updated));

      expect(state.messages).to.have.lengthOf(1);
      expect(state.messages[0]).to.deep.equal(updated);
    });
  });

  describe('addMessages', () => {
    it('adds a batch of messages and keeps them sorted by timestamp', () => {
      const newer = { id: 'msg-2', sender: 'va', text: 'New', timestamp: 2 };
      const older = { id: 'msg-1', sender: 'user', text: 'Old', timestamp: 1 };

      const state = chatbotReducer(
        undefined,
        chatbotActions.addMessages([newer, older]),
      );

      expect(state.messages).to.have.lengthOf(2);
      expect(state.messages[0].id).to.equal('msg-1');
      expect(state.messages[1].id).to.equal('msg-2');
    });

    it('deduplicates messages in a batch by id', () => {
      const original = { id: 'msg-1', sender: 'va', text: 'A', timestamp: 1 };
      const replacement = {
        id: 'msg-1',
        sender: 'va',
        text: 'B',
        timestamp: 2,
      };

      const state = chatbotReducer(
        undefined,
        chatbotActions.addMessages([original, replacement]),
      );

      expect(state.messages).to.have.lengthOf(1);
      expect(state.messages[0].text).to.equal('B');
    });
  });

  describe('setError', () => {
    it('sets errorMessage and connectionStatus to error', () => {
      const state = chatbotReducer(
        undefined,
        chatbotActions.setError('Network failure'),
      );

      expect(state.errorMessage).to.equal('Network failure');
      expect(state.connectionStatus).to.equal('error');
    });
  });

  describe('clearError', () => {
    it('nulls out errorMessage', () => {
      const withError = { ...initialState, errorMessage: 'oops' };
      const state = chatbotReducer(withError, chatbotActions.clearError());

      expect(state.errorMessage).to.be.null;
    });
  });

  describe('setAgentTyping', () => {
    it('sets isAgentTyping to true', () => {
      const state = chatbotReducer(
        undefined,
        chatbotActions.setAgentTyping(true),
      );

      expect(state.isAgentTyping).to.equal(true);
    });

    it('sets isAgentTyping to false', () => {
      const withTyping = { ...initialState, isAgentTyping: true };
      const state = chatbotReducer(
        withTyping,
        chatbotActions.setAgentTyping(false),
      );

      expect(state.isAgentTyping).to.equal(false);
    });
  });

  describe('resetChat', () => {
    it('resets messaging state to initial values', () => {
      const withData = {
        hasAcceptedDisclaimer: true,
        connectionStatus: 'connected',
        messages: [{ id: '1', sender: 'va', text: 'hi', timestamp: 1 }],
        errorMessage: 'some error',
        isAgentTyping: true,
      };
      const state = chatbotReducer(withData, chatbotActions.resetChat());

      expect(state.connectionStatus).to.equal('idle');
      expect(state.messages).to.deep.equal([]);
      expect(state.errorMessage).to.be.null;
      expect(state.isAgentTyping).to.equal(false);
    });

    it('does NOT reset hasAcceptedDisclaimer', () => {
      const withAccepted = { ...initialState, hasAcceptedDisclaimer: true };
      const state = chatbotReducer(withAccepted, chatbotActions.resetChat());

      expect(state.hasAcceptedDisclaimer).to.equal(true);
    });
  });

  // ─── Selectors ───────────────────────────────────────────────────────────

  describe('selectors', () => {
    const sampleMessage = { id: '1', sender: 'va', text: 'hi', timestamp: 1 };
    const mockState = {
      chatbot: {
        hasAcceptedDisclaimer: true,
        connectionStatus: 'connected',
        messages: [sampleMessage],
        errorMessage: 'oops',
        isAgentTyping: true,
      },
    };

    it('selectChatbotHasAcceptedDisclaimer returns the value from state', () => {
      expect(selectChatbotHasAcceptedDisclaimer(mockState)).to.equal(true);
    });

    it('selectConnectionStatus returns the value from state', () => {
      expect(selectConnectionStatus(mockState)).to.equal('connected');
    });

    it('selectMessages returns the messages array', () => {
      expect(selectMessages(mockState)).to.deep.equal([sampleMessage]);
    });

    it('selectErrorMessage returns the error string', () => {
      expect(selectErrorMessage(mockState)).to.equal('oops');
    });

    it('selectIsAgentTyping returns the typing flag', () => {
      expect(selectIsAgentTyping(mockState)).to.equal(true);
    });

    it('selectIsConnected returns true when status is connected', () => {
      expect(selectIsConnected(mockState)).to.equal(true);
    });

    it('selectIsConnected returns false for non-connected statuses', () => {
      const idleState = {
        chatbot: { ...mockState.chatbot, connectionStatus: 'idle' },
      };
      expect(selectIsConnected(idleState)).to.equal(false);
    });

    describe('when state.chatbot is missing (fallback to initialState)', () => {
      it('selectChatbotHasAcceptedDisclaimer returns false', () => {
        expect(selectChatbotHasAcceptedDisclaimer({})).to.equal(false);
      });

      it('selectConnectionStatus returns idle', () => {
        expect(selectConnectionStatus({})).to.equal('idle');
      });

      it('selectMessages returns empty array', () => {
        expect(selectMessages({})).to.deep.equal([]);
      });

      it('selectErrorMessage returns null', () => {
        expect(selectErrorMessage({})).to.be.null;
      });

      it('selectIsAgentTyping returns false', () => {
        expect(selectIsAgentTyping({})).to.equal(false);
      });

      it('selectIsConnected returns false', () => {
        expect(selectIsConnected({})).to.equal(false);
      });
    });
  });
});
