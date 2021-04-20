import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WaitForFeatureToggles from './WaitForFeatureToggles';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from './ChatbotError';

window.React = React;
window.ReactDOM = ReactDOM;

const loadWebChat = () => {
  const script = document.createElement('script');

  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.12.0/webchat-es5.js';
  script.crossOrigin = 'anonymous';

  document.body.appendChild(script);
};

loadWebChat();

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
      setError(true);
      setLoading(false);
      clearInterval(intervalId);
    }
  }, timeout);
}

export default function App(props) {
  const [isLoading, setLoading] = useState(!window.WebChat);
  const [error, setError] = useState(false);

  const TIMEOUT_DURATION_MS = 250;
  const DEFAULT_WEBCHAT_TIMEOUT = 1 * 60 * 1000;

  const webchatTimeout = props.webchatTimeout
    ? props.webchatTimeout
    : DEFAULT_WEBCHAT_TIMEOUT;
  const MAX_INTERVAL_CALL_COUNT = webchatTimeout / TIMEOUT_DURATION_MS;

  if (isLoading) {
    checkForWebchat(
      setLoading,
      setError,
      MAX_INTERVAL_CALL_COUNT,
      TIMEOUT_DURATION_MS,
    );
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }
  return error ? <ChatbotError /> : <WaitForFeatureToggles />;
}
