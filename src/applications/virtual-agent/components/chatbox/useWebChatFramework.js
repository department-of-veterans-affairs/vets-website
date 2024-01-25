import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { COMPLETE, ERROR, LOADING } from './loadingStatus';

function checkForWebchat(setLoadingStatus, MAX_INTERVAL_CALL_COUNT, timeout) {
  let intervalCallCount = 0;
  const intervalId = setInterval(() => {
    intervalCallCount++;
    if (window.WebChat) {
      setLoadingStatus(COMPLETE);
      clearInterval(intervalId);
    } else if (intervalCallCount > MAX_INTERVAL_CALL_COUNT) {
      Sentry.captureException(new Error('Failed to load webchat framework'));
      setLoadingStatus(ERROR);
      clearInterval(intervalId);
    }
  }, timeout);
}

export const loadWebChat = () => {
  const script = document.createElement('script');

  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.15.8/webchat.js';
  script.crossOrigin = 'anonymous';
  script.dataset.testid = 'webchat-framework-script';

  document.body.appendChild(script);
};

const TIMEOUT_DURATION_MS = 250;

export default function useWebChatFramework(props) {
  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    loadWebChat();
  }, []);

  const [loadingStatus, setLoadingStatus] = useState(
    window.WebChat ? COMPLETE : LOADING,
  );

  const MAX_INTERVAL_CALL_COUNT = props.timeout / TIMEOUT_DURATION_MS;

  if (loadingStatus === LOADING) {
    checkForWebchat(
      setLoadingStatus,
      MAX_INTERVAL_CALL_COUNT,
      TIMEOUT_DURATION_MS,
    );
  }

  return { loadingStatus, WebChatFramework: window.WebChat };
}
