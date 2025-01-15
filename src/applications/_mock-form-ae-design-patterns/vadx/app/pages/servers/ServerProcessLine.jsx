import React from 'react';
import PropTypes from 'prop-types';

export const ServerProcessLine = ({ line }) => {
  return (
    <div
      className="vads-u-margin-bottom--0p25"
      style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        transition: 'opacity 200ms ease-in',
      }}
    >
      {line}
    </div>
  );
};

ServerProcessLine.propTypes = {
  line: PropTypes.string.isRequired,
};
