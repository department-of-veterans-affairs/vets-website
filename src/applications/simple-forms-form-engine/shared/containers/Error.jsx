import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ error }) => {
  const message =
    typeof error === 'string' ? `Error: ${error}` : error.toString();

  return <div>{message}</div>;
};

Error.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default Error;
