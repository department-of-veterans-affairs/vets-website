import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';

function checkForWebchat(
  setLoading,
  setError,
  MAX_INTERVAL_CALL_COUNT,
  timeout,
) {
  let intervalCallCount = 0;
  const intervalId = setInterval(() => {
    intervalCallCount++;
    if (window.WebChat) {
      setLoading(false);
      setError(false);
      clearInterval(intervalId);
    } else if (intervalCallCount > MAX_INTERVAL_CALL_COUNT) {
      Sentry.captureException('Failed to load webchat framework');
      setError(true);
      setLoading(false);
      clearInterval(intervalId);
    }
  }, timeout);
}

const loadWebChat = () => {
  const script = document.createElement('script');

  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.12.0/webchat-es5.js';
  script.crossOrigin = 'anonymous';
  script.dataset.testid = 'webchat-framework-script';

  document.body.appendChild(script);
};

const TIMEOUT_DURATION_MS = 250;
const DEFAULT_WEBCHAT_TIMEOUT = 1 * 60 * 1000;

export default function useWebChatFramework(props) {
  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    loadWebChat();
  }, []);

  const [isLoading, setLoading] = useState(!window.WebChat);
  const [error, setError] = useState(false);

  const webchatTimeout = props.webchatTimeout || DEFAULT_WEBCHAT_TIMEOUT;
  const MAX_INTERVAL_CALL_COUNT = webchatTimeout / TIMEOUT_DURATION_MS;

  if (isLoading) {
    checkForWebchat(
      setLoading,
      setError,
      MAX_INTERVAL_CALL_COUNT,
      TIMEOUT_DURATION_MS,
    );
  }

  return { isLoading, error, WebChatFramework: window.WebChat };
}
