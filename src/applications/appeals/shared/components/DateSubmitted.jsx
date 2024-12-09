import React from 'react';
import PropTypes from 'prop-types';

export const DateSubmitted = ({ submitDate, appType }) => (
  <>
    <h4>Date you filed your {appType}</h4>
    <span>{submitDate}</span>
  </>
);

DateSubmitted.propTypes = {
  submitDate: PropTypes.string.isRequired,
  appType: PropTypes.string,
};
