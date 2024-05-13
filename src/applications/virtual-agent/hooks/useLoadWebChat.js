import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle/';

const loadWebChat = webchatUpdateEnabled => {
  const script = document.createElement('script');

  if (webchatUpdateEnabled) {
    script.src =
      'https://www.unpkg.com/botframework-webchat@4.16.1-main.20240405.6a623fb/dist/webchat.js';
  } else {
    script.src =
      'https://cdn.botframework.com/botframework-webchat/4.15.8/webchat.js';
  }

  script.crossOrigin = 'anonymous';
  script.dataset.testid = 'webchat-framework-script';

  document.body.appendChild(script);
};

export default function useLoadWebChat() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const webchatUpdateEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentUpgradeWebchat14158,
  );

  useEffect(
    () => {
      window.React = React;
      window.ReactDOM = ReactDOM;
      loadWebChat(webchatUpdateEnabled);
    },
    [webchatUpdateEnabled],
  );
}
