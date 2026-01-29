import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import useWebChat from '../hooks/useWebChat';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import ChatbotError from './ChatbotError';
import WebChat from './WebChat';
import { getTokenExpiresAt } from '../utils/sessionStorage';
import { getAlertTargetTs } from '../utils/expiry';

export default function App({ virtualAgentEnableParamErrorDetection }) {
  // Default to complete because when feature toggles are loaded we assume paramLoadingStatus is complete and will error out otherwise
  const [paramLoadingStatus, setParamLoadingStatus] = useState(COMPLETE);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isSessionPersistenceEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled,
  );
  const { token, code, expired, webChatFramework, loadingStatus } = useWebChat(
    virtualAgentEnableParamErrorDetection,
    paramLoadingStatus,
  );

  // UX: keep alert visible until the user closes it, then remount WebChat
  const [alertOpen, setAlertOpen] = useState(false);
  const [webchatKey, setWebchatKey] = useState(0);
  const [resetting, setResetting] = useState(false);
  const prevTokenRef = useRef(null);

  useEffect(
    () => {
      if (isSessionPersistenceEnabled && expired) setAlertOpen(true);
    },
    [expired, isSessionPersistenceEnabled],
  );

  // Polling interval for token expiry check (default: 5 seconds)
  const POLLING_INTERVAL_MS = 5000;
  useEffect(
    () => {
      if (!isSessionPersistenceEnabled) return undefined;
      const id = setInterval(() => {
        const target = getAlertTargetTs(getTokenExpiresAt());
        if (target && Date.now() >= target) {
          setAlertOpen(true);
        }
      }, POLLING_INTERVAL_MS);
      return () => clearInterval(id);
    },
    [isSessionPersistenceEnabled],
  );

  useEffect(
    () => {
      if (!resetting) return;
      if (prevTokenRef.current && token && token !== prevTokenRef.current) {
        setWebchatKey(k => k + 1);
        setResetting(false);
      }
    },
    [token, resetting],
  );

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <va-loading-indicator message="Loading Chatbot" />;
    case COMPLETE:
      return (
        <>
          {alertOpen && (
            <div style={{ marginBottom: '1rem' }}>
              <va-alert status="info" uswds>
                <h3 slot="headline">Chat ended</h3>
                <p>
                  We end chats after 1 hour of no activity. You can still review
                  this chat history. Or start a new chat. If you start a new
                  one, we'll delete this current chat history.
                </p>
                <va-button
                  full-width
                  text="Start new chat"
                  onClick={() => {
                    setAlertOpen(false);
                    try {
                      window.dispatchEvent(new Event('va-chatbot-reset'));
                    } catch (e) {
                      // no-op: safest to ignore errors dispatching global event
                    }
                    setResetting(true);
                    prevTokenRef.current = token;
                  }}
                />
              </va-alert>
            </div>
          )}
          <WebChat
            token={token}
            code={code}
            webChatFramework={webChatFramework}
            setParamLoadingStatus={setParamLoadingStatus}
            key={webchatKey}
            freeze={alertOpen || resetting}
          />
        </>
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}

App.propTypes = {
  virtualAgentEnableParamErrorDetection: PropTypes.bool,
};
