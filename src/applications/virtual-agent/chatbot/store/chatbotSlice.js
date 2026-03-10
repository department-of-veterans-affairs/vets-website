import { createSlice } from '@reduxjs/toolkit';
/* eslint-disable no-param-reassign */
// ^ we are using immer under the hood which allows us to "mutate" state so this is safe to disable
// https://redux-toolkit.js.org/usage/immer-reducers

/** @typedef {import('../../types/common.d').ChatMessage} ChatMessage */
/** @typedef {import('../../types/common.d').ConnectionStatus} ConnectionStatus */

/**
 * @typedef {Object} ChatbotState
 * @property {boolean} hasAcceptedDisclaimer
 * @property {ConnectionStatus} connectionStatus
 * @property {ChatMessage[]} messages
 * @property {string|null} errorMessage
 * @property {boolean} isAgentTyping
 * @property {Object|null} genesysConfig
 */

/** @type {ChatbotState} */
const initialState = {
  hasAcceptedDisclaimer: false,
  connectionStatus: 'idle',
  messages: [],
  errorMessage: null,
  isAgentTyping: false,
  genesysConfig: null,
};

/**
 * Inserts or updates a message by id while preserving chronological order.
 * @param {ChatMessage[]} messages
 * @param {ChatMessage} message
 */
function upsertMessage(messages, message) {
  if (!message || !message.id) return;

  const existingIndex = messages.findIndex(item => item.id === message.id);
  if (existingIndex >= 0) {
    messages[existingIndex] = message;
    return;
  }

  messages.push(message);
  messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
}

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    acceptDisclaimer: state => {
      state.hasAcceptedDisclaimer = true;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
      if (action.payload === 'connected') {
        state.errorMessage = null;
      }
    },
    addMessage: (state, action) => {
      upsertMessage(state.messages, action.payload);
    },
    addMessages: (state, action) => {
      const messages = action.payload || [];
      messages.forEach(message => upsertMessage(state.messages, message));
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
      state.connectionStatus = 'error';
    },
    clearError: state => {
      state.errorMessage = null;
    },
    setAgentTyping: (state, action) => {
      state.isAgentTyping = action.payload;
    },
    setGenesysConfig: (state, action) => {
      state.genesysConfig = action.payload;
    },
    resetChat: state => {
      state.connectionStatus = initialState.connectionStatus;
      state.messages = initialState.messages;
      state.errorMessage = initialState.errorMessage;
      state.isAgentTyping = initialState.isAgentTyping;
      // intentionally NOT resetting hasAcceptedDisclaimer
    },
  },
});

const selectChatbotState = state => state.chatbot || initialState;

export const selectChatbotHasAcceptedDisclaimer = state =>
  selectChatbotState(state).hasAcceptedDisclaimer;

export const selectConnectionStatus = state =>
  selectChatbotState(state).connectionStatus;

export const selectMessages = state => selectChatbotState(state).messages;

export const selectErrorMessage = state =>
  selectChatbotState(state).errorMessage;

export const selectIsAgentTyping = state =>
  selectChatbotState(state).isAgentTyping;

export const selectGenesysConfig = state =>
  selectChatbotState(state).genesysConfig;

export const selectIsConnected = state =>
  selectChatbotState(state).connectionStatus === 'connected';

export const chatbotActions = chatbotSlice.actions;

export default chatbotSlice.reducer;
