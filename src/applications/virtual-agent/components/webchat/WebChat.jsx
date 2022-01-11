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

  // const store = useMemo(
  //   () => {
  //     // console.log('up-dated value is: ', updated);
  //     console.log('in store hook');
  //     createStore(
  //       {},
  //       GreetUser.makeBotGreetUser(
  //         csrfToken,
  //         apiSession,
  //         'http://5c56-2601-249-8a00-2440-b4c6-c703-78d9-3344.ngrok.io',
  //         environment.BASE_URL,
  //         userFirstName === '' ? 'noFirstNameFound' : userFirstName,
  //       ),
  //     );
  //   },
  //   [createStore],
  // );
  //
  // const directLine = useMemo(
  //   () => {
  //     if (!updated) {
  //       console.log('in direct line hook');
  //       createDirectLine({
  //         token,
  //         domain:
  //           'https://northamerica.directline.botframework.com/v3/directline',
  //       });
  //     }
  //   },
  //   [token, createDirectLine, updated],
  // );

  const IDLE_TIMEOUT = 30000;

  const [testVal, setTestVal] = useState(0);
  const [botDirectLine, setBotDirectLine] = useState();
  const [botStore, setBotStore] = useState();
  const [timer, setTimer] = useState(() => Date.now() + IDLE_TIMEOUT);

  // updated = 0
  // first try: set initial store
  // setUpdated = updated + 1
  // updated = 1
  // do nothing
  //
  // updated = 2
  // 30s in and update happens

  const updateBot = useCallback(
    () => {
      (function() {
        console.log('inside updateBot function');
        console.log('updated: ', updated);
        if (!updated) {
          setUpdated(true);
          console.log('first store render');
          setBotStore(
            createStore(
              {},
              GreetUser.makeBotGreetUser(
                csrfToken,
                apiSession,
                'http://5c56-2601-249-8a00-2440-b4c6-c703-78d9-3344.ngrok.io',
                environment.BASE_URL,
                userFirstName === '' ? 'noFirstNameFound' : userFirstName,
              ),
            ),
          );
          setTestVal(1)
        } else {
          console.log('updated store render')
          setBotStore(
            createStore(
              {},
              GreetUser.makeBotGreetUser(
                csrfToken,
                apiSession,
                'http://5c56-2601-249-8a00-2440-b4c6-c703-78d9-3344.ngrok.io',
                'fabulous-friday',
                userFirstName === '' ? 'noFirstNameFound' : userFirstName,
              ),
            ),
          );
          setTestVal(2)
        }
        // console.log('testVal: ', testVal)
        setBotDirectLine(
          createDirectLine({
            token,
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
          }),
        );

        // setUpdated(true);
        // console.log('updating bot');
        // console.log('old store: ', botStore.getState());
        //
        // setBotStore(
        //   createStore(
        //     {},
        //     GreetUser.makeBotGreetUser(
        //       csrfToken,
        //       apiSession,
        //       '76a5-2601-241-8f80-54b0-8549-f157-2895-500b.ngrok.io',
        //       'fabulous-friday',
        //       'Kha',
        //     ),
        //   ),
        // );
        //
        // setBotDirectLine(
        //   createDirectLine({
        //     token,
        //     domain:
        //       'https://northamerica.directline.botframework.com/v3/directline',
        //   }),
        // );
        // console.log('new store: ', botStore.getState());
        // console.log('new directline: ', botDirectLine);
      })();
    },
    [setTimer, setBotStore, updated],
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
