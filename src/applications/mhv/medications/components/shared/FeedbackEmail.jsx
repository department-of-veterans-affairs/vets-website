import React from 'react';
import PropTypes from 'prop-types';

const FeedbackEmail = ({ forPrint = false }) => {
  if (forPrint)
    return (
      <span className="print-only vads-u-display--inline-block">
        vamhvfeedback@va.gov
      </span>
    );

  return (
    <a className="no-print" href="mailto: vamhvfeedback@va.gov">
      vamhvfeedback@va.gov
    </a>
  );
};

export default FeedbackEmail;

FeedbackEmail.propTypes = {
  forPrint: PropTypes.bool,
};
