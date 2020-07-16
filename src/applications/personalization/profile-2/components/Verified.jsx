import React from 'react';
import PropTypes from 'prop-types';

/**
 * A simple component that adds a Font Awesome green check mark next to its
 * children content
 */
const Verified = ({ children }) => (
  <span className="vads-u-display--flex">
    <i className="fa fa-check vads-u-color--green vads-u-margin-top--0p5" />
    <p className="vads-u-margin--0 vads-u-padding-left--1 medium-screen:vads-u-padding-left--3">
      {children}
    </p>
  </span>
)

Verified.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Verified;
