import piiReplace from './piiReplace';
import * as _ from 'lodash';

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
      _.assign(action.payload, { text: piiReplace(action.payload.text) });
    }
    return next(action);
  },
};

export default GreetUser;
