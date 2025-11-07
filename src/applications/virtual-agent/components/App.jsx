import React, { useEffect, useRef, useState } from 'react';

import useWebChat from '../hooks/useWebChat';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import ChatbotError from './ChatbotError';
import WebChat from './WebChat';

export default function App(props) {
  // Default to complete because when feature toggles are loaded we assume paramLoadingStatus is complete and will error out otherwise
  const [paramLoadingStatus, setParamLoadingStatus] = useState(COMPLETE);
  const { token, code, expired, webChatFramework, loadingStatus } = useWebChat(
    props,
    paramLoadingStatus,
  );

  // UX: keep alert visible until the user closes it, then remount WebChat
  const [alertOpen, setAlertOpen] = useState(false);
  const [webchatKey, setWebchatKey] = useState(0);
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (expired) setAlertOpen(true);
    },
    [expired],
  );

  useEffect(
    () => {
      if (!alertOpen) return undefined;
      const el = alertRef.current;
      if (!el) return undefined;
      const onClose = () => {
        setAlertOpen(false);
        try {
          window.dispatchEvent(new Event('va-chatbot-reset'));
        } catch (e) {
          // no-op
        }
        setWebchatKey(k => k + 1);
      };
      el.addEventListener('closeEvent', onClose);
      return () => el.removeEventListener('closeEvent', onClose);
    },
    [alertOpen],
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
              <va-alert status="info" uswds closeable ref={alertRef}>
                <h3 slot="headline">Your chat session has expired</h3>
                <p>
                  Your chat session has expired. Close this alert to start a new
                  conversation.
                </p>
              </va-alert>
            </div>
          )}
          <WebChat
            token={token}
            code={code}
            webChatFramework={webChatFramework}
            setParamLoadingStatus={setParamLoadingStatus}
            key={webchatKey}
            freeze={alertOpen}
          />
        </>
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}
