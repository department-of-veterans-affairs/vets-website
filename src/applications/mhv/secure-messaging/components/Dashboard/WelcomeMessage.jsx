import React from 'react';
import FeedbackEmail from '../shared/FeedbackEmail';

const WelcomeMessage = () => {
  return (
    <div className="welcome-message">
      <h2>What to know as you try out this tool</h2>
      <p>
        We’re giving the trusted My HealtheVet secure messaging tool a new home
        here on VA.gov. You can use this tool to communicate securely with your
        care team online-just like you can today on the My HealtheVet website.
      </p>
      <p>
        We need your feedback to help us keep making this tool better for you
        and all Veterans.
      </p>
      <p>
        Email us at <FeedbackEmail /> to tell us what you think. We can also
        answer questions about how to use the tool.
      </p>
    </div>
  );
};

export default WelcomeMessage;
