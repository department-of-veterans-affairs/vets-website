import React, { useCallback, useEffect, useState } from 'react';
import MarkdownRenderer from './markdownRenderer';
// import GreetUser from './makeBotGreetUser';
import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useTimeoutAt from './useTimeoutAt';

const renderMarkdown = text => MarkdownRenderer.render(text);

const WebChat = ({ token, WebChatFramework, apiSession }) => {
  const { ReactWebChat, createDirectLine, createStore } = WebChatFramework;
  const csrfToken = localStorage.getItem('csrfToken');
  const userFirstName = useSelector(state =>
    _.upperFirst(_.toLower(state.user.profile.userFullName.first)),
  );

  const IDLE_TIMEOUT = 1800000;
  const staticTimeout = 3600000;

  const [botDirectLine, setBotDirectLine] = useState();
  const [botStore, setBotStore] = useState();
  const [timer, setTimer] = useState(() => Date.now() + IDLE_TIMEOUT);
  const [staticTime, setStaticTime] = useState(
    () => Date.now() + staticTimeout,
  );

  const GreetUser = {
    makeBotGreetUser: (
      // eslint-disable-next-line no-shadow
      csrfToken,
      // eslint-disable-next-line no-shadow
      apiSession,
      apiURL,
      baseURL,
      // eslint-disable-next-line no-shadow
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
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        // Reset the timer when the connection established, or the user sends an activity
        setTimer(Date.now() + IDLE_TIMEOUT);
        setStaticTime(Date.now() + staticTimeout);
      }
      if (action.type === 'WEB_CHAT/SUBMIT_SEND_BOX') {
        setTimer(Date.now() + IDLE_TIMEOUT);
      }
      return next(action);
    },
  };

  // Timer printouts
  // useEffect(
  //   () => {
  //   console.log('-------30 seconds: ', timer - Date.now());
  //     console.log('-------60 seconds: ', staticTime - Date.now());
  //   },
  //   [timer, staticTime],
  // );

  const updateBot = useCallback(
    () => {
      (function() {
        setBotStore(
          createStore(
            {},
            GreetUser.makeBotGreetUser(
              csrfToken,
              apiSession,
              'http://ccaa-2601-249-8a00-2440-8c3b-63d0-6a86-c037.ngrok.io',
              environment.BASE_URL,
              userFirstName === '' ? 'noFirstNameFound' : userFirstName,
            ),
          ),
        );

        // console.log('botStore in updateBot: ', botStore.getState())

        setBotDirectLine(
          createDirectLine({
            token,
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
          }),
        );
      })();
    },
    [setTimer, setBotStore, setStaticTime],
  );

  useEffect(updateBot, [updateBot]);

  useEffect(
    () => {
      if (botStore) {
        console.log('botStore in UseEffect: ', botStore.getState());
      }
    },
    [botStore],
  );

  useTimeoutAt(updateBot, timer);
  useTimeoutAt(updateBot, staticTime);

  const styleOptions = {
    hideUploadButton: true,
    botAvatarBackgroundColor: '#003e73', // color-primary-darker
    botAvatarInitials: 'VA',
    userAvatarBackgroundColor: '#003e73', // color-primary-darker
    userAvatarInitials: 'You',
    primaryFont: 'Source Sans Pro, sans-serif',
    bubbleBorderRadius: 5,
    bubbleFromUserBorderRadius: 5,
    bubbleBorderWidth: 0,
    bubbleFromUserBorderWidth: 0,
    bubbleBackground: '#e1f3f8',
    bubbleFromUserBackground: '#f1f1f1',
    bubbleNubSize: 10,
    bubbleFromUserNubSize: 10,
    timestampColor: '#000000',
    suggestedActionLayout: 'flow',
    suggestedActionBackground: '#0071BB',
    suggestedActionTextColor: 'white',
    suggestedActionBorderRadius: '5px',
    suggestedActionBorderWidth: 0,
  };

  return (
    <>
      <div data-testid={'webchat'} style={{ height: '550px', width: '100%' }}>
        <ReactWebChat
          styleOptions={styleOptions}
          directLine={botDirectLine}
          store={botStore}
          renderMarkdown={renderMarkdown}
        />
      </div>
    </>
  );
};

export default WebChat;
