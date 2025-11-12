import React from 'react';
import DisclaimerActivity from '../components/activities/DisclaimerActivity';

export const activityMiddleware = () => next => card => {
  if (card.activity?.type === 'trace') return false;

  const { activity } = card || {};
  const isDisclaimer =
    activity?.type === 'message' &&
    activity?.channelData?.isDisclaimer &&
    activity?.channelData?.category === 'ai-disclaimer';

  if (isDisclaimer) {
    return () => (
      <DisclaimerActivity
        text={activity.text}
        data-activity-id={activity.id}
        className="va-webchat-ai-disclaimer"
      />
    );
  }

  return next(card);
};
