import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect'; // Adding this library for accessibility reasons to distinguish between desktop and mobile

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

// Hooks
import useBotPonyFill from '../hooks/useBotPonyfill';
import useDirectLine from '../hooks/useDirectline';
import useRxSkillEventListener from '../hooks/useRxSkillEventListener';
import useSetSendBoxMessage from '../hooks/useSetSendBoxMessage';
import useWebChatStore from '../hooks/useWebChatStore';

// Event Listeners
import clearBotSessionStorageEventListener from '../event-listeners/clearBotSessionStorageEventListener';
import signOutEventListener from '../event-listeners/signOutEventListener';

// Middleware
import { activityMiddleware } from '../middleware/activityMiddleware';
import { cardActionMiddleware } from '../middleware/cardActionMiddleware';

// Selectors
import selectUserFirstName from '../selectors/selectUserFirstName';
import selectAccountUuid from '../selectors/selectAccountUuid';
import selectUserCurrentlyLoggedIn from '../selectors/selectUserCurrentlyLoggedIn';

// Utils and Helpers
import MarkdownRenderer from '../utils/markdownRenderer';
import handleTelemetry from '../utils/telemetry';
import validateParameters from '../utils/validateParameters';
import logger from '../utils/logger';

const styleOptions = {
  hideUploadButton: true,
  botAvatarBackgroundColor: '#003e73',
  botAvatarInitials: 'VA',
  userAvatarBackgroundColor: '#003e73',
  userAvatarInitials: 'You',
  primaryFont: 'Source Sans Pro, sans-serif',
  bubbleBorderRadius: 5,
  bubbleFromUserBackground: '#f0f0f0',
  bubbleFromUserBorderRadius: 5,
  bubbleBorderWidth: 0,
  bubbleFromUserBorderWidth: 0,
  bubbleBackground: '#e1f3f8',
  bubbleNubSize: 10,
  bubbleFromUserNubSize: 10,
  timestampColor: '#000000',
  suggestedActionLayout: 'stacked',
  suggestedActionsStackedHeight: 49.2 * 5,
  suggestedActionActiveBackground: 'rgb(17,46,81)',
  suggestedActionBackgroundColorOnHover: 'rgb(0,62,115)',
  suggestedActionBackgroundColor: 'rgb(0, 113, 187)',
  suggestedActionTextColor: 'white',
  suggestedActionBorderRadius: 5,
  suggestedActionBorderWidth: 0,
  microphoneButtonColorOnDictate: 'rgb(255, 255, 255)',
}; // color-primary-darker // color-primary-darker

export const renderMarkdown = text => MarkdownRenderer.render(text);

const WebChat = ({
  token,
  webChatFramework,
  apiSession,
  setParamLoadingStatus,
}) => {
  const {
    createDirectLine,
    createStore,
    Components: { BasicWebChat, Composer },
  } = webChatFramework;
  const csrfToken = localStorage.getItem('csrfToken');

  const userFirstName = useSelector(selectUserFirstName);
  const userUuid = useSelector(selectAccountUuid);
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);

  const [speechPonyfill, setBotPonyfill] = useState();
  const [isRXSkill, setIsRXSkill] = useState();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // value of specific toggle
  const isComponentToggleOn = useToggleValue(
    TOGGLE_NAMES.virtualAgentComponentTesting,
  );

  const isRootBotToggleOn = useToggleValue(
    TOGGLE_NAMES.virtualAgentEnableRootBot,
  );

  const isDatadogLoggingEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentEnableDatadogLogging,
  );

  logger.info('Winston logger: Ding! Test message');

  validateParameters({
    csrfToken,
    apiSession,
    userFirstName,
    userUuid,
    setParamLoadingStatus,
    isDatadogLoggingEnabled,
  });

  const store = useWebChatStore({
    createStore,
    csrfToken,
    apiSession,
    userFirstName,
    userUuid,
    isMobile,
    environment,
    isComponentToggleOn,
    isRootBotToggleOn,
  });

  clearBotSessionStorageEventListener(isLoggedIn);
  signOutEventListener(isDatadogLoggingEnabled);

  useBotPonyFill(setBotPonyfill, environment);
  useRxSkillEventListener(setIsRXSkill);
  useSetSendBoxMessage(isRXSkill);

  const directLine = useDirectLine(createDirectLine, token, isLoggedIn);

  return (
    <div data-testid="webchat" style={{ height: '550px', width: '100%' }}>
      <Composer
        cardActionMiddleware={cardActionMiddleware}
        activityMiddleware={activityMiddleware}
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
        onTelemetry={handleTelemetry}
        {...isRXSkill === 'true' && {
          webSpeechPonyfillFactory: speechPonyfill,
        }}
      >
        <BasicWebChat />
      </Composer>
    </div>
  );
};

WebChat.propTypes = {
  apiSession: PropTypes.string.isRequired,
  setParamLoadingStatus: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  webChatFramework: PropTypes.shape({
    createDirectLine: PropTypes.func.isRequired,
    createStore: PropTypes.func.isRequired,
    Components: PropTypes.shape({
      BasicWebChat: PropTypes.func.isRequired,
      Composer: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default WebChat;
