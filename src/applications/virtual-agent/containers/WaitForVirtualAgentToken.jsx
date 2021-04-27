import React from 'react';
import ChatbotError from './ChatbotError';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import WebChat from './WebChat';
import useVirtualAgentToken from './useVirtualAgentToken';

export default function WaitForVirtualAgentToken() {
  const { token, tokenLoading } = useVirtualAgentToken();

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        {token && <WebChat token={token} />}
        {!token && !tokenLoading && <ChatbotError />}
        {tokenLoading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}
