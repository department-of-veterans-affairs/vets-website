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

  // document.body.appendChild(script);
};

loadWebChat();

export default function App() {
  const [isLoaded, setLoaded] = useState(!!window.WebChat);
  const [error, setError] = useState(false);

  let count = 0;

  if (!isLoaded) {
    const intervalId = setInterval(() => {
      count++;
      if (count > 6) {
        setError(true);
        clearInterval(intervalId);
      }
      if (window.WebChat) {
        setLoaded(true);
        clearInterval(intervalId);
      }
    }, 300);
    if (error) {
      return <ChatbotError />;
    } else {
      return (
        <LoadingIndicator message={'Waiting on webchat framework . . .'} />
      );
    }
  }

  return <WaitForFeatureToggles />;
}
