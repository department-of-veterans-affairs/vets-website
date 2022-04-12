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

    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const data = action.payload.activity;
      if (
        data.type === 'message' &&
        data.text &&
        data.text.includes('Please wait a moment. Sending you to sign in...') &&
        data.from.role === 'bot'
      ) {
        const event = new Event('webchat-auth-activity');
        event.data = action.payload.activity;
        window.dispatchEvent(event);
      }
    }
    return next(action);
  },
};

export default GreetUser;
