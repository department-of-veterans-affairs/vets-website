const CHATBOT_SCENARIO = 'va_coronavirus_chatbot';

export const createBotConnection = tokenPayload => {
  let domain = undefined;
  if (tokenPayload.directLineURI) {
    domain = `https://${tokenPayload.directLineURI}/v3/directline`;
  }
  return window.WebChat.createDirectLine({
    token: tokenPayload.connectorToken,
    domain,
  });
};

export const getWebchatStore = (locale, jsonWebToken) => {
  return window.WebChat.createStore({}, store => next => action => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      store.dispatch({
        type: 'DIRECT_LINE/POST_ACTIVITY',
        meta: { method: 'keyboard' },
        payload: {
          activity: {
            type: 'invoke',
            name: 'InitConversation',
            locale,
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
  });
};
