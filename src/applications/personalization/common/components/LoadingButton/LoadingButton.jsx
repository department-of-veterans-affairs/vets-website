import React from 'react';
import PropTypes from 'prop-types';

export const LoadingButton = ({ text }) => {
  return (
    <button className="va-loading-button" type="button">
      <div className="va-loading-button-ring" /> {text}
    </button>
  );
};

LoadingButton.propTypes = {
  text: PropTypes.string,
};

LoadingButton.defaultProps = {
  text: 'Updating',
};
