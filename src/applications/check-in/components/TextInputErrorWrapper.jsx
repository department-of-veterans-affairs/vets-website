import React from 'react';
import PropTypes from 'prop-types';
// This component can be removed once DS fixes error state, evaluate during next audit.
const TextInputErrorWrapper = ({ error, children }) =>
  error ? <div className="vads-u-padding-left--2p5">{children}</div> : children;

TextInputErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.bool,
};

export default TextInputErrorWrapper;
