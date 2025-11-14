import React, { useState } from 'react';
import PropTypes from 'prop-types';

import useWebChat from '../hooks/useWebChat';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import ChatbotError from './ChatbotError';
import WebChat from './WebChat';

export default function App({ virtualAgentEnableParamErrorDetection }) {
  // Default to complete because when feature toggles are loaded we assume paramLoadingStatus is complete and will error out otherwise
  const [paramLoadingStatus, setParamLoadingStatus] = useState(COMPLETE);
  const { token, code, webChatFramework, loadingStatus } = useWebChat(
    virtualAgentEnableParamErrorDetection,
    paramLoadingStatus,
  );

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <va-loading-indicator message="Loading Chatbot" />;
    case COMPLETE:
      return (
        <WebChat
          token={token}
          code={code}
          webChatFramework={webChatFramework}
          setParamLoadingStatus={setParamLoadingStatus}
        />
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}

App.propTypes = {
  virtualAgentEnableParamErrorDetection: PropTypes.bool,
};
