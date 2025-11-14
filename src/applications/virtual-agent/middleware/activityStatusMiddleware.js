import React from 'react';

export const activityStatusMiddleware = () => next => args => {
  const { activity } = args || {};
  const isRagAgentResponse =
    activity?.type === 'message' &&
    activity?.channelData?.category === 'rag-agent-response';

  if (isRagAgentResponse) {
    const originalStatus = next(args);
    return (
      <div className="va-chatbot-status-wrapper">
        <div className="va-chatbot-ai-disclaimer">
          This answer is AI-generated and may contain inaccuracies. Verify
          important information.
        </div>
        {originalStatus}
      </div>
    );
  }

  return next(args);
};
