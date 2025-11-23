import React from 'react';
import { AI_DISCLAIMER_TEXT } from '../utils/aiDisclaimerConstants';

export const activityStatusMiddleware = () => next => args => {
  const { activity } = args || {};
  const isRagAgentResponse =
    activity?.type === 'message' &&
    activity?.channelData?.category === 'rag-agent-response';

  if (isRagAgentResponse) {
    const originalStatus = next(args);
    return (
      <div className="va-chatbot-status-wrapper">
        <div className="va-chatbot-ai-disclaimer">{AI_DISCLAIMER_TEXT}</div>
        {originalStatus}
      </div>
    );
  }

  return next(args);
};
