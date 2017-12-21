import React from 'react';

function FeedbackSubmitted({ shouldSendResponse }) {
  return (
    <div id="feedback-submitted">
      <h4 className="feedback-widget-title">Thank you for your feedback!</h4>
      {shouldSendResponse && (
        <p className="feedback-widget-intro">We’ll get back to you soon.</p>
      )}
    </div>
  );
}

export default FeedbackSubmitted;
