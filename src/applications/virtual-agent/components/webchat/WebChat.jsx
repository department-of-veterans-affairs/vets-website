import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MarkdownRenderer from './markdownRenderer';
import GreetUser from './makeBotGreetUser';
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

  const [updated, setUpdated] = useState(false);

  const store = useMemo(
    () => {
      console.log('up-dated value is: ', updated);
      if (!updated) {
        console.log('in store hook');
        createStore(
          {},
          GreetUser.makeBotGreetUser(
            csrfToken,
            apiSession,
            '76a5-2601-241-8f80-54b0-8549-f157-2895-500b.ngrok.io',
            environment.BASE_URL,
            userFirstName === '' ? 'noFirstNameFound' : userFirstName,
          ),
        );
      }
    },
    [createStore, updated],
  );

  const directLine = useMemo(
    () =>
      createDirectLine({
        token,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
      }),
    [token, createDirectLine],
    console.log('in direct line hook'),
  );

  const IDLE_TIMEOUT = 30000;

  const [botStore, setBotStore] = useState(store);
  const [timer, setTimer] = useState(() => Date.now() + IDLE_TIMEOUT);

  const updateBot = useCallback(
    () => {
      (function() {
        setUpdated(true);
        console.log('updating bot');
        console.log('old store: ', botStore.getState());

        setBotStore(
          createStore(
            {},
            GreetUser.makeBotGreetUser(
              csrfToken,
              apiSession,
              '76a5-2601-241-8f80-54b0-8549-f157-2895-500b.ngrok.io',
              'fabulous-friday',
              'Kha',
            ),
          ),
        );

        setBotDirectLine(
          createDirectLine({
            token,
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
          }),
        );
        console.log('new store: ', botStore.getState());
        //console.log('new directline: ', botDirectLine);
      })();
    },
    [setTimer, setBotStore],
  );

  // useEffect(
  //   () => {
  //     console.log(botStore.getState());
  //   },
  //   [botStore],
  // );

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
