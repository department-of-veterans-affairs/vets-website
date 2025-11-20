import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect'; // Adding this library for accessibility reasons to distinguish between desktop and mobile

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

// Hooks
import useDirectLine from '../hooks/useDirectline';
import useWebChatStore from '../hooks/useWebChatStore';
import useCharacterLimit from '../hooks/useCharacterLimit';

// Event Listeners
import clearBotSessionStorageEventListener from '../event-listeners/clearBotSessionStorageEventListener';
import signOutEventListener from '../event-listeners/signOutEventListener';

// Middleware
import { activityMiddleware } from '../middleware/activityMiddleware';
import { activityStatusMiddleware } from '../middleware/activityStatusMiddleware';
import { cardActionMiddleware } from '../middleware/cardActionMiddleware';

// Selectors
import selectUserCurrentlyLoggedIn from '../selectors/selectUserCurrentlyLoggedIn';

// Utils and Helpers
import MarkdownRenderer from '../utils/markdownRenderer';
import handleTelemetry from '../utils/telemetry';

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
  suggestedActionBackgroundColorOnActive: 'rgb(17,46,81)',
  suggestedActionBackgroundColorOnHover: 'rgb(0,62,115)',
  suggestedActionBackgroundColor: 'rgb(0, 113, 187)',
  suggestedActionTextColor: 'white',
  suggestedActionBorderRadius: 5,
  suggestedActionBorderWidth: 0,
  autoScrollSnapOnPage: true,
};

export const renderMarkdown = text => MarkdownRenderer.render(text);

const WebChat = ({ code, webChatFramework }) => {
  const {
    createDirectLine,
    createStore,
    Components: { BasicWebChat, Composer },
  } = webChatFramework;
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // value of specific toggle
  const isComponentToggleOn = useToggleValue(
    TOGGLE_NAMES.virtualAgentComponentTesting,
  );

  const isStsAuthEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentUseStsAuthentication,
  );

  const isSessionPersistenceEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled,
  );

  const isAIDisclaimerEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentShowAiDisclaimer,
  );

  const store = useWebChatStore({
    createStore,
    code,
    isMobile,
    environment,
    isComponentToggleOn,
    isStsAuthEnabled,
    isSessionPersistenceEnabled,
  });

  // Register global event listeners once and clean up on unmount
  useEffect(
    () => {
      const cleanupBeforeUnload = clearBotSessionStorageEventListener(
        isLoggedIn,
      );
      const cleanupSignOut = signOutEventListener(isLoggedIn);

      return () => {
        if (typeof cleanupBeforeUnload === 'function') cleanupBeforeUnload();
        if (typeof cleanupSignOut === 'function') cleanupSignOut();
      };
    },
    [isLoggedIn],
  );

  const directLine = useDirectLine(createDirectLine);

  useCharacterLimit(isAIDisclaimerEnabled);

  return (
    <div data-testid="webchat" style={{ height: '550px', width: '100%' }}>
      <Composer
        cardActionMiddleware={cardActionMiddleware}
        activityMiddleware={activityMiddleware}
        {...(isAIDisclaimerEnabled ? { activityStatusMiddleware } : {})}
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
        onTelemetry={handleTelemetry}
      >
        <BasicWebChat />
      </Composer>
    </div>
  );
};

WebChat.propTypes = {
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
  code: PropTypes.string,
};

export default WebChat;
