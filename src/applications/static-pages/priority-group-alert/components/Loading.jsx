import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ label, message }) => (
  <va-loading-indicator label={label} message={message} />
);

Loading.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
};

Loading.defaultProps = {
  label: 'loading',
  message: 'Loading...',
};

export default Loading;
