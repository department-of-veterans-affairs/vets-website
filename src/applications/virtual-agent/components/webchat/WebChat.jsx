import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  const IDLE_TIMEOUT = 30000;

  const [botDirectLine, setBotDirectLine] = useState();
  const [botStore, setBotStore] = useState();
  const [timer, setTimer] = useState(() => Date.now() + IDLE_TIMEOUT);

  const GreetUser = {
    makeBotGreetUser: (
      csrfToken,
      apiSession,
      apiURL,
      baseURL,
      userFirstName,
    ) => ({ dispatch }) => next => action => {
      console.log('action received :', action.type);
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
      if (
        action.type === 'DIRECT_LINE/CONNECT_FULFILLED' ||
        action.type === 'WEB_CHAT/SUBMIT_SEND_BOX'
      ) {
        // Reset the timer when the connection established, or the user sends an activity
        setTimer(Date.now() + IDLE_TIMEOUT);
      }
      return next(action);
    },
  };

  const updateBot = useCallback(
    () => {
      (function() {
        console.log('in update');
        setBotStore(
          createStore(
            {},
            GreetUser.makeBotGreetUser(
              csrfToken,
              apiSession,
              'http://6242-2603-7000-4500-a05-c1af-f806-818e-5721.ngrok.io',
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
    [setTimer, setBotStore],
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
