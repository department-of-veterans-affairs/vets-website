import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { isMobile } from 'react-device-detect'; // Adding this library for accessibility reasons to distinguish between desktop and mobile
import { ERROR } from '../chatbox/loadingStatus';
// import PropTypes from 'prop-types';
import StartConvoAndTrackUtterances from './startConvoAndTrackUtterances';
import MarkdownRenderer from './markdownRenderer';
import {
  LOGGED_IN_FLOW,
  CONVERSATION_ID_KEY,
  TOKEN_KEY,
  clearBotSessionStorage,
  IS_RX_SKILL,
} from '../chatbox/utils';
import {
  cardActionMiddleware,
  ifMissingParamsCallSentry,
  hasAllParams,
} from './helpers/webChat';

const renderMarkdown = text => MarkdownRenderer.render(text);

export const setMicrophoneMessage = (isRXSkill, theDocument) => () => {
  let intervalId;
  if (isRXSkill === 'true') {
    intervalId = setTimeout(() => {
      const sendBox = theDocument.querySelector(
        'input[class="webchat__send-box-text-box__input"]',
      );
      const attributeSetAMessage = attr =>
        sendBox?.setAttribute(attr, 'Type or enable the microphone to speak');

      ['aria-label', 'placeholder'].forEach(attributeSetAMessage);
    }, 0); // delay this code until all synchronous code runs.
  }
  return () => clearTimeout(intervalId);
};

const WebChat = ({
  token,
  WebChatFramework,
  apiSession,
  setParamLoadingStatus,
}) => {
  const { ReactWebChat, createDirectLine, createStore } = WebChatFramework;
  const csrfToken = localStorage.getItem('csrfToken');
  const userFirstName = useSelector(state =>
    _.upperFirst(_.toLower(state.user.profile.userFullName.first)),
  );
  const userUuid = useSelector(state => state.user.profile.accountUuid);
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);

  ifMissingParamsCallSentry(csrfToken, apiSession, userFirstName, userUuid);
  if (!hasAllParams(csrfToken, apiSession, userFirstName, userUuid)) {
    // if this component is rendered then we know that the feature toggles are
    // loaded and thus we can assume all the params are available if not we
    // should error out
    setParamLoadingStatus(ERROR);
  }

  const store = useMemo(
    () => {
      return createStore(
        {},
        StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
          csrfToken,
          apiSession,
          process.env.VIRTUAL_AGENT_BACKEND_URL || environment.API_URL,
          environment.BASE_URL,
          userFirstName === '' ? 'noFirstNameFound' : userFirstName,
          userUuid === null ? 'noUserUuid' : userUuid, // Because PVA cannot support empty strings or null pass in 'null' if user is not logged in
          isMobile,
        ),
      );
    },
    [createStore],
  );
  let directLineToken = token;
  let conversationId = '';
  let directLine = {};

  // eslint-disable-next-line sonarjs/no-collapsible-if

  if (sessionStorage.getItem(LOGGED_IN_FLOW) === 'true' && isLoggedIn) {
    directLineToken = sessionStorage.getItem(TOKEN_KEY);
    conversationId = sessionStorage.getItem(CONVERSATION_ID_KEY);
  }

  // eslint-disable-next-line no-restricted-globals
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

  directLine = useMemo(
    () =>
      createDirectLine({
        token: directLineToken,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
        conversationId,
        watermark: '',
      }),
    [createDirectLine],
  );

  const BUTTONS = 49.2;
  const styleOptions = {
    hideUploadButton: true,
    botAvatarBackgroundColor: '#003e73',
    botAvatarInitials: 'VA',
    userAvatarBackgroundColor: '#003e73',
    userAvatarInitials: 'You',
    primaryFont: 'Source Sans Pro, sans-serif',
    bubbleBorderRadius: 5,
    bubbleFromUserBorderRadius: 5,
    bubbleBorderWidth: 0,
    bubbleFromUserBorderWidth: 0,
    bubbleBackground: '#e1f3f8',
    bubbleFromUserBackground: '#f0f0f0',
    bubbleNubSize: 10,
    bubbleFromUserNubSize: 10,
    timestampColor: '#000000',
    suggestedActionLayout: 'stacked',
    suggestedActionsStackedHeight: BUTTONS * 5,
    suggestedActionActiveBackground: 'rgb(17,46,81)',
    suggestedActionBackgroundColorOnHover: 'rgb(0,62,115)',
    suggestedActionBackgroundColor: 'rgb(0, 113, 187)',
    suggestedActionTextColor: 'white',
    suggestedActionBorderRadius: 5,
    suggestedActionBorderWidth: 0,
    microphoneButtonColorOnDictate: 'rgb(255, 255, 255)',
  }; // color-primary-darker // color-primary-darker

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

  async function createPonyFill(webchat) {
    const region =
      environment.isDev() || environment.isLocalhost() ? 'eastus' : 'eastus2';

    async function callVirtualAgentVoiceTokenApi() {
      return apiRequest('/virtual_agent_speech_token', { method: 'POST' });
    }
    const speechToken = await callVirtualAgentVoiceTokenApi();
    return webchat.createCognitiveServicesSpeechServicesPonyfillFactory({
      credentials: {
        region,
        authorizationToken: speechToken.token,
      },
    });
  }

  const [speechPonyfill, setBotPonyfill] = useState();

  useEffect(() => {
    createPonyFill(window.WebChat).then(res => {
      setBotPonyfill(() => res);
    });
  }, []);
  const [isRXSkill, setIsRXSkill] = useState();
  useEffect(
    () => {
      const getRXStorageSession = () =>
        setIsRXSkill(() => sessionStorage.getItem(IS_RX_SKILL));

      window.addEventListener('rxSkill', getRXStorageSession);
      return () => window.removeEventListener('rxSkill', getRXStorageSession);
    },
    [isRXSkill],
  );

  useEffect(setMicrophoneMessage(isRXSkill, document));

  if (isRXSkill === 'true') {
    return (
      <div data-testid="webchat" style={{ height: '550px', width: '100%' }}>
        <ReactWebChat
          styleOptions={styleOptions}
          directLine={directLine}
          store={store}
          renderMarkdown={renderMarkdown}
          onTelemetry={handleTelemetry}
          webSpeechPonyfillFactory={speechPonyfill}
        />
      </div>
    );
  }
  if (window.WebChat && isRXSkill !== 'true') {
    // find the send box element
    const sendBox = document.querySelector(
      'input[class="webchat__send-box-text-box__input"]',
    );
    // change the placeholder text of send box back to the default if it isn't already
    if (
      document.querySelector(
        'input[placeholder="Type or enable the microphone to speak"]',
      )
    ) {
      sendBox.setAttribute('aria-label', 'Type your message');
      sendBox.setAttribute('placeholder', 'Type your message');
    }
  }
  return (
    <div data-testid="webchat" style={{ height: '550px', width: '100%' }}>
      <ReactWebChat
        cardActionMiddleware={cardActionMiddleware}
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
