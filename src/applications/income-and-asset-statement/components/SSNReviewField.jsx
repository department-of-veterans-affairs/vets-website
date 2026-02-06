import React from 'react';
import PropTypes from 'prop-types';

export const SSNReviewField = ({ last4Digits }) => (
  <div className="review-row">
    <dt>Last 4 digits of Social Security number</dt>
    <dd
      className="dd-privacy-hidden"
      data-dd-action-name="Last 4 digits of SSN"
    >
      {last4Digits}
    </dd>
  </div>
);

SSNReviewField.propTypes = {
  last4Digits: PropTypes.string,
};
