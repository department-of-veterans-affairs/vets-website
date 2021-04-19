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

export default function App() {
  const [isLoaded, setLoaded] = useState(!!window.WebChat);
  const [error, setError] = useState(false);

  let intervalCallCount = 0;
  const MAX_INTERVAL_CALL_COUNT = 6;

  if (!isLoaded) {
    const intervalId = setInterval(() => {
      intervalCallCount++;
      if (window.WebChat) {
        setLoaded(true);
        setError(false);
        clearInterval(intervalId);
      } else if (intervalCallCount > MAX_INTERVAL_CALL_COUNT) {
        setError(true);
        clearInterval(intervalId);
      }
    }, 300);
    return error ? (
      <ChatbotError />
    ) : (
      <LoadingIndicator message={'Loading Virtual Agent'} />
    );
  }

  return <WaitForFeatureToggles />;
}
