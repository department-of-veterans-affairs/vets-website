const GreetUser = {
  makeBotGreetUser: (csrfToken, apiSession, apiURL, userFirstName) => ({
    dispatch,
  }) => next => action => {
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
              userFirstName,
            },
          },
        },
        type: 'DIRECT_LINE/POST_ACTIVITY',
      });
    }
    return next(action);
  },
};

export default GreetUser;
