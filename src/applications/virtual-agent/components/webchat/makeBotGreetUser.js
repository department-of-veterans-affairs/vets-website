import piiReplace from './piiReplace';

const GreetUser = {
  makeBotGreetUser: (
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
  ) => ({ dispatch }) => next => action => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      dispatch({
        meta: {
          method: 'keyboard',
        },
        payload: {
          activity: {
            channelData: {
              postBack: true,
            },
            // Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
            name: 'startConversation',
            type: 'event',
            value: {
              csrfToken,
              apiSession,
              apiURL,
              baseURL,
              userFirstName,
            },
          },
        },
        type: 'DIRECT_LINE/POST_ACTIVITY',
      });
    }

    if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
      // eslint-disable-next-line no-param-reassign
      action.payload.text = piiReplace(action.payload.text);
    }
    return next(action);
  },
};

export default GreetUser;
