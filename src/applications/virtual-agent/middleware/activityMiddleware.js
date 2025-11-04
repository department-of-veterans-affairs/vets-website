import React from 'react';
import PropTypes from 'prop-types';

const DisclaimerActivity = ({ text }) => {
  // Inline styles to visually distinguish AI disclaimer messages while
  // keeping existing classNames for backwards-compatible theming/tests.
  const containerStyle = {
    background: '#fff6e0', // soft highlight
    borderLeft: '4px solid #ff9900',
    borderRadius: 4,
    padding: '12px 16px',
    margin: '8px 0',
    color: '#1b1b1b',
    fontFamily: 'Source Sans Pro, sans-serif',
  };

  const titleStyle = {
    fontWeight: 700,
    marginBottom: 40,
    fontSize: 14,
    lineHeight: '20px',
    color: '#1b1b1b',
  };

  const bodyStyle = {
    fontSize: 14,
    lineHeight: '20px',
    fontStyle: 'italic',
    margin: 0,
  };

  return (
    <div
      className="va-webchat-ai-disclaimer"
      role="note"
      aria-live="polite"
      style={containerStyle}
    >
      <div className="va-webchat-ai-disclaimer__title" style={titleStyle}>
        AI disclaimer
      </div>
      <div className="va-webchat-ai-disclaimer__body" style={bodyStyle}>
        {text}
      </div>
    </div>
  );
};

DisclaimerActivity.propTypes = {
  text: PropTypes.string,
};

export const activityMiddleware = () => next => card => {
  if (card.activity.type === 'trace') {
    return false;
  }

  const { activity } = card || {};
  const isDisclaimer =
    activity?.type === 'message' && activity?.channelData?.isDisclaimer;

  if (isDisclaimer) {
    return () => <DisclaimerActivity text={activity.text} />;
  }

  return next(card);
};
