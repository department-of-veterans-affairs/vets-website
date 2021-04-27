import React from 'react';
import ReactDOM from 'react-dom';
import WaitForFeatureToggles from './WaitForFeatureToggles';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from './ChatbotError';
import useWaitForWebchatFramework from './useWaitForWebchatFramework';

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

export default function App(props) {
  const { isLoading, error } = useWaitForWebchatFramework(props);

  if (isLoading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }
  return error ? <ChatbotError /> : <WaitForFeatureToggles />;
}

// function NewApp() {
//   const { isLoading, isError, token } = useWebChat();

//   if (isLoading) {
//     return <LoadingIndicator message={'Loading Virtual Agent'} />;
//   }

//   if (isError) {
//     return <ChatbotError />;
//   }

//   return <WebChat token={token} />;
// }
