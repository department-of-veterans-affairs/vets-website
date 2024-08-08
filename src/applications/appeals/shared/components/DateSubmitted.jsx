import React from 'react';
import PropTypes from 'prop-types';

export const DateSubmitted = ({ submitDate }) => (
  <>
    <p />
    <h4 className="vads-u-margin-top--0">Date you filed your claim</h4>
    <span>{submitDate}</span>
  </>
);

DateSubmitted.propTypes = {
  submitDate: PropTypes.string.isRequired,
};
