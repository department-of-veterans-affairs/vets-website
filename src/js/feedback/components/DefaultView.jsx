import React from 'react';
import PropTypes from 'prop-types';

function GiveUsFeedback({ feedbackButtonClicked }) {
  return (
    <div className="usa-grid-full">
      <div className="usa-width-one-half">
        <h4 className="feedback-widget-title">Tell us what you think</h4>
        <p className="feedback-widget-intro">
          We are always looking for ways to make Vets.gov better.
        </p>
      </div>
      <div className="usa-width-one-half">
        <button onClick={feedbackButtonClicked} className="usa-button-secondary feedback-button">Give us feedback</button>
      </div>
    </div>
  );
}

GiveUsFeedback.propTypes = {
  feedbackButtonClicked: PropTypes.func.isRequired
};

export default GiveUsFeedback;
