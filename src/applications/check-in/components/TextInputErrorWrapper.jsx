import React from 'react';
import PropTypes from 'prop-types';

const TextInputErrorWrapper = ({ error, children }) =>
  error ? <div className="vads-u-padding-left--2">{children}</div> : children;

TextInputErrorWrapper.propTypes = {
  error: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default TextInputErrorWrapper;
