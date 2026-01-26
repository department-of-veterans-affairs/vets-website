import { createSlice } from '@reduxjs/toolkit';
/* eslint-disable no-param-reassign */
// ^ we are using immer under the hood which allows us to "mutate" state so this is safe to disable
// https://redux-toolkit.js.org/usage/immer-reducers

/**
 * @typedef {Object} ChatbotState
 * @property {boolean} hasAcceptedDisclaimer
 */

/** @type {ChatbotState} */
const initialState = {
  hasAcceptedDisclaimer: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    acceptDisclaimer: state => {
      state.hasAcceptedDisclaimer = true;
    },
  },
});

const selectChatbotState = state => state.chatbot || initialState;

export const selectChatbotHasAcceptedDisclaimer = state =>
  selectChatbotState(state).hasAcceptedDisclaimer;

export const chatbotActions = chatbotSlice.actions;

export default chatbotSlice.reducer;
