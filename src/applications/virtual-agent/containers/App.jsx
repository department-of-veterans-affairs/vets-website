import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WaitForFeatureToggles from './WaitForFeatureToggles';

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

  if (!isLoaded) {
    const intervalId = setInterval(() => {
      if (window.WebChat) {
        setLoaded(true);
        clearInterval(intervalId);
      }
    }, 300);
    return 'waiting on webchat framework . . .';
  }

  return <WaitForFeatureToggles />;
}
