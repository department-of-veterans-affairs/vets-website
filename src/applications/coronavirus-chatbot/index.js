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

export const initializeChatbot = async () => {
  const path = `/coronavirus_chatbot/tokens?locale=en-US`;

  try {
    const csrfTokenStored = localStorage.getItem('csrfToken');
    const { token } = await apiRequest(path, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'X-CSRF-Token': csrfTokenStored,
      },
    });
    return configureWebchat(token);
  } catch (error) {
    recordInitChatbotFailure(error);
    throw error;
  }
};
