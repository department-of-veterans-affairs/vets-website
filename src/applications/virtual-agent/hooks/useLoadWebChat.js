import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function ensurePartytown() {
  if (window.__PARTYTOWN__LOADED__) return;

  const config = document.createElement('script');
  config.innerHTML = `partytown = { lib: 'https://unpkg.com/@builder.io/partytown@0.8.0/lib/' };`;

  const loader = document.createElement('script');
  loader.src = 'https://unpkg.com/@builder.io/partytown@0.8.0/lib/partytown.js';
  loader.crossOrigin = '';

  document.head.appendChild(config);
  document.head.appendChild(loader);

  window.__PARTYTOWN__LOADED__ = true;
}

function loadWebChatWithPartytown() {
  const existing = document.querySelector(
    'script[data-testid="webchat-framework-script"]',
  );
  if (existing) return;

  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.17.0/webchat.js';
  script.crossOrigin = 'anonymous';
  script.dataset.testid = 'webchat-framework-script';

  document.body.appendChild(script);

  window.dispatchEvent(new CustomEvent('ptupdate'));
}

export default function useLoadWebChat() {
  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;

    ensurePartytown();
    loadWebChatWithPartytown();
  }, []);
}
