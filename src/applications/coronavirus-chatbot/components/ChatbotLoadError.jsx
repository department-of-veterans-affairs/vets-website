import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function ChatbotLoadError(_props) {
  return (
    <AlertBox
      headline="Error Loading Chatbot"
      content="We are sorry there was an issue loading the chatbot, please refresh the page to try again. If the problem persists there may be a caching issue, please clear your cache and refresh the page."
      status="error"
    />
  );
}
