import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function loadWebChat() {
  const script = document.createElement('script');

  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.17.0/webchat.js';

  script.crossOrigin = 'anonymous';
  script.dataset.testid = 'webchat-framework-script';

  document.body.appendChild(script);
}

export default function useLoadWebChat() {
  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    loadWebChat();
  }, []);
}
