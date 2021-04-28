import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import useWaitForFeatureToggles from './useWaitForFeatureToggles';

import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from './WebChat';
import ChatbotError from './ChatbotError';

function useLoadWebChat() {
  const { loading: togglesLoading } = useWaitForFeatureToggles();
  const { tokenLoading, error, token } = useVirtualAgentToken({
    togglesLoading,
  });

  return {
    loading: togglesLoading || tokenLoading,
    error,
    token,
  };
}

export default function WaitForFeatureToggles() {
  const { loading, error, token } = useLoadWebChat();

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        {token && <WebChat token={token} />}
        {error && <ChatbotError />}
        {loading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}
