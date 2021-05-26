import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { COMPLETE, ERROR, LOADING } from './loadingStatus';

function checkForWebchat(
  setLoading,
  setError,
  setLoadingStatus,
  MAX_INTERVAL_CALL_COUNT,
  timeout,
) {
  let intervalCallCount = 0;
  const intervalId = setInterval(() => {
    intervalCallCount++;
    if (window.WebChat) {
      setLoading(false);
      setError(false);
      setLoadingStatus(COMPLETE);
      clearInterval(intervalId);
    } else if (intervalCallCount > MAX_INTERVAL_CALL_COUNT) {
      Sentry.captureException(new Error('Failed to load webchat framework'));
      setError(true);
      setLoading(false);
      setLoadingStatus(ERROR);
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

export default function useWebChatFramework(props) {
  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    loadWebChat();
  }, []);

  const [isLoading, setLoading] = useState(!window.WebChat);
  const [error, setError] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(LOADING);

  const MAX_INTERVAL_CALL_COUNT = props.timeout / TIMEOUT_DURATION_MS;

  if (isLoading) {
    checkForWebchat(
      setLoading,
      setError,
      setLoadingStatus,
      MAX_INTERVAL_CALL_COUNT,
      TIMEOUT_DURATION_MS,
    );
  }

  return { isLoading, error, loadingStatus, WebChatFramework: window.WebChat };
}
