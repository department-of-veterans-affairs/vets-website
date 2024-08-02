import React, { useState } from 'react';
import useBotOutgoingActivityEventListener from '../hooks/useBotOutgoingActivityEventListener';
import useWebMessageActivityEventListener from '../hooks/useWebMessageActivityEventListener';
import Bot from './Bot';

export default function Chatbox() {
  const [chatBotLoadTime] = useState(Date.now());

  useBotOutgoingActivityEventListener(chatBotLoadTime);
  useWebMessageActivityEventListener();

  return (
    <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
      <div className="vads-u-background-color--primary-darker vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
          VA chatbot (beta)
        </h2>
      </div>
      <Bot />
    </div>
  );
}
