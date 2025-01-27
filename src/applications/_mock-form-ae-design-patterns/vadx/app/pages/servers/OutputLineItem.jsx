import React from 'react';
import PropTypes from 'prop-types';

export const OutputLineItem = ({ line }) => {
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

OutputLineItem.propTypes = {
  line: PropTypes.string.isRequired,
};
