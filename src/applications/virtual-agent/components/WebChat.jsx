import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect'; // Adding this library for accessibility reasons to distinguish between desktop and mobile

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

// Hooks
import useDirectLine from '../hooks/useDirectline';
import useWebChatStore from '../hooks/useWebChatStore';

// Event Listeners
import clearBotSessionStorageEventListener from '../event-listeners/clearBotSessionStorageEventListener';
import signOutEventListener from '../event-listeners/signOutEventListener';

// Middleware
import { activityMiddleware } from '../middleware/activityMiddleware';
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

/**
 * WebChat component rendering BotFramework Web Chat.
 *
 * The `freeze` prop temporarily blocks outbound activities (e.g., send message,
 * post activity) while keeping the existing transcript visible. This is used
 * when the token-expiry alert is shown. The value is passed via ref to
 * middleware in useWebChatStore so we can toggle blocking without recreating
 * the store.
 *
 * @param {Object} props
 * @param {string} props.token - Direct Line token
 * @param {string} [props.code] - Optional auth code for STS flows
 * @param {Object} props.webChatFramework - Factories and components from Web Chat
 * @param {boolean} [props.freeze=false] - When true, outbound actions are blocked; transcript remains visible
 */
const WebChat = ({ token, code, webChatFramework, freeze = false }) => {
  const {
    createDirectLine,
    createStore,
    Components: { BasicWebChat, Composer },
  } = webChatFramework;
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);
  const rootRef = useRef(null);

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

  const store = useWebChatStore({
    createStore,
    freeze,
    token,
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

  const directLine = useDirectLine(createDirectLine, token, freeze);

  // When frozen, blur any focused element and disable the underlying send box
  // input/button so keyboard users cannot type or tab into it. When unfrozen,
  // restore the controls.
  useEffect(
    () => {
      try {
        if (freeze) {
          const el = document.activeElement;
          if (el && typeof el.blur === 'function') el.blur();
        }
      } catch (e) {
        // no-op
      }

      const root = rootRef.current;
      if (!root) return;

      const input = root.querySelector('input[type="text"]');
      const button = root.querySelector('button[aria-label], button[title]');

      if (freeze) {
        if (input) {
          input.setAttribute('disabled', 'true');
          input.setAttribute('aria-disabled', 'true');
          input.setAttribute('tabIndex', '-1');
        }
        if (button) {
          button.setAttribute('disabled', 'true');
          button.setAttribute('aria-disabled', 'true');
          button.setAttribute('tabIndex', '-1');
        }
      } else {
        if (input) {
          input.removeAttribute('disabled');
          input.removeAttribute('aria-disabled');
          input.removeAttribute('tabIndex');
        }
        if (button) {
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.removeAttribute('tabIndex');
        }
      }
    },
    [freeze],
  );

  return (
    <div
      ref={rootRef}
      data-testid="webchat"
      style={{ height: '550px', width: '100%', position: 'relative' }}
    >
      <Composer
        cardActionMiddleware={cardActionMiddleware}
        activityMiddleware={activityMiddleware}
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
        onTelemetry={handleTelemetry}
      >
        <BasicWebChat />
      </Composer>
      {freeze && (
        <>
          {/* Overlay the send box area to block pointer events while frozen */}
          <div
            aria-hidden="true"
            data-testid="sendbox-overlay"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 56,
              background: 'rgba(255,255,255,0.6)',
              zIndex: 4,
              pointerEvents: 'auto',
            }}
          />
          <div
            data-testid="session-expired-banner"
            style={{
              position: 'absolute',
              right: 16,
              bottom: 56,
              color: '#b50909',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: '0.02em',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            <va-icon style={{ marginRight: '0.2rem' }} icon="info" />
            Chat ended
          </div>
        </>
      )}
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
  freeze: PropTypes.bool,
};

export default WebChat;
