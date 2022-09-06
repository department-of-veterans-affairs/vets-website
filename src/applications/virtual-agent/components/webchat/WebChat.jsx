import React, { useMemo, useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import GreetUser from './makeBotGreetUser';
import MarkdownRenderer from './markdownRenderer';
import {
  CONVERSATION_ID_KEY,
  TOKEN_KEY,
  clearBotSessionStorage,
  IN_AUTH_EXP,
} from '../chatbox/utils';

const renderMarkdown = text => MarkdownRenderer.render(text);

const WebChat = ({ token, WebChatFramework, apiSession }) => {
  const { ReactWebChat, createDirectLine, createStore } = WebChatFramework;
  const csrfToken = localStorage.getItem('csrfToken');
  const userFirstName = useSelector(state =>
    _.upperFirst(_.toLower(state.user.profile.userFullName.first)),
  );
  const userUuid = useSelector(state => state.user.profile.accountUuid);
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const requireAuth = useSelector(
    state => state.featureToggles.virtualAgentAuth,
  );
  const [loading, setLoading] = useState(true);
  const [directLine, setDirectLine] = useState(null);

  const store = useMemo(
    () =>
      createStore(
        {},
        GreetUser.makeBotGreetUser(
          csrfToken,
          apiSession,
          environment.API_URL,
          environment.BASE_URL,
          userFirstName === '' ? 'noFirstNameFound' : userFirstName,
          userUuid === null ? 'noUserUuid' : userUuid, // Because PVA cannot support empty strings or null pass in 'null' if user is not logged in
          requireAuth,
        ),
      ),
    [createStore],
  );

  // Default values (not reconnecting)
  let conversationId = '';
  let watermark = '';
  const directLineToken = token;

  addEventListener('beforeunload', () => {
    clearBotSessionStorage(false, isLoggedIn);
  });

  const links = document.querySelectorAll('div#account-menu ul li a');
  if (links && links.length) {
    const link = links[links.length - 1];
    if (link.innerText === 'Sign Out') {
      link.addEventListener('click', () => {
        clearBotSessionStorage(true);
      });
    }
  }

  useEffect(
    () => {
      setLoading(true);
      async function fetchNewToken() {
        // console.log('current token is: ', sessionStorage.getItem(TOKEN_KEY));
        // console.log('fetching new token');
        const res = await fetch(
          `https://directline.botframework.com/v3/directline/conversations/${sessionStorage.getItem(
            CONVERSATION_ID_KEY,
          )}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`,
            },
          },
        );
        const { token: newToken } = await res.json();
        // console.log('new token', newToken);
        return newToken;
      }

      if (sessionStorage.getItem(IN_AUTH_EXP) === 'true' && isLoggedIn) {
        // reconnect to existing conversation
        conversationId = sessionStorage.getItem(CONVERSATION_ID_KEY);
        // set watermark to 0
        watermark = '0';
        // get new token by sending conversationId
        fetchNewToken().then(newTokenData => {
          console.log('new token for new connection', newTokenData);
          const directLineInstance = createDirectLine({
            token: newTokenData,
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
            conversationId,
            watermark,
          });
          setDirectLine(directLineInstance);
          setLoading(false);
        });
      } else {
        // start new conversation
        const directLineInstance = createDirectLine({
          token: directLineToken,
          domain:
            'https://northamerica.directline.botframework.com/v3/directline',
          conversationId,
          watermark,
        });
        setDirectLine(directLineInstance);
        setLoading(false);
      }
    },
    [createDirectLine],
  );

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

  const handleTelemetry = event => {
    const { name } = event;

    if (name === 'submitSendBox') {
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': 'submitSendBox',
        'button-background-color': 'gray',
        time: new Date(),
      });
    }
  };
  if (loading) {
    return <div />;
  }

  return (
    <div data-testid="webchat" style={{ height: '550px', width: '100%' }}>
      <ReactWebChat
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
        onTelemetry={handleTelemetry}
      />
    </div>
  );
};

export default WebChat;
