import { apiRequest } from 'platform/utilities/api';
import { markdownRenderer } from './utils';
import localStorage from 'platform/utilities/storage/localStorage';
import { recordInitChatbotFailure } from './gaEvents';

const CHATBOT_SCENARIO = 'va_coronavirus_chatbot';
const STYLE_OPTIONS = {
  hideSendBox: true,
  botAvatarInitials: 'VA',
  userAvatarInitials: 'You',
  backgroundColor: '#F8F8F8',
  primaryFont: 'Source Sans Pro, sans-serif',
  bubbleMinWidth: 100,
};

const createBotConnection = tokenPayload => {
  let domain = undefined;
  if (tokenPayload.directLineURI) {
    domain = `https://${tokenPayload.directLineURI}/v3/directline`;
  }
  return window.WebChat.createDirectLine({
    token: tokenPayload.connectorToken,
    domain,
  });
};

const configureWebchat = jsonWebToken => {
  const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
  const botConnection = createBotConnection(tokenPayload);

  const webchatStore = window.WebChat.createStore(
    {},
    store => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        store.dispatch({
          type: 'DIRECT_LINE/POST_ACTIVITY',
          meta: { method: 'keyboard' },
          payload: {
            activity: {
              type: 'invoke',
              name: 'InitConversation',
              locale: tokenPayload.locale,
              value: {
                jsonWebToken,
                triggeredScenario: {
                  trigger: CHATBOT_SCENARIO,
                },
              },
            },
          },
        });
      }
      return next(action);
    },
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
