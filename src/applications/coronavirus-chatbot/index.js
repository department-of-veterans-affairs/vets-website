import { apiRequest } from 'platform/utilities/api';
import { markdownRenderer } from './utils';
import localStorage from 'platform/utilities/storage/localStorage';
import { recordInitChatbotFailure } from './gaEvents';
import * as WebchatModule from './webchat';

const STYLE_OPTIONS = {
  hideSendBox: true,
  botAvatarInitials: 'VA',
  userAvatarInitials: 'You',
  backgroundColor: '#F8F8F8',
  primaryFont: 'Source Sans Pro, sans-serif',
  bubbleMinWidth: 100,
};

export const configureWebchat = jsonWebToken => {
  const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
  const botConnection = WebchatModule.createBotConnection(tokenPayload);
  const webchatStore = WebchatModule.getWebchatStore(
    tokenPayload.locale,
    jsonWebToken,
  );

  return {
    directLine: botConnection,
    styleOptions: STYLE_OPTIONS,
    store: webchatStore,
    renderMarkdown: text => markdownRenderer.render(text),
    userID: tokenPayload.userId,
    locale: tokenPayload.locale,
  };
};

const getBotToken = csrfToken => {
  const path = `/coronavirus_chatbot/tokens?locale=en-US`;

  return apiRequest(path, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
  });
};

export const initializeChatbot = async () => {
  try {
    const csrfTokenStored = localStorage.getItem('csrfToken');
    const { token } = await getBotToken(csrfTokenStored);
    return configureWebchat(token);
  } catch (_error) {
    try {
      const csrfTokenStored = localStorage.getItem('csrfToken');
      const { token } = await getBotToken(csrfTokenStored);
      return configureWebchat(token);
    } catch (error) {
      recordInitChatbotFailure(error);
      throw error;
    }
  }
};
