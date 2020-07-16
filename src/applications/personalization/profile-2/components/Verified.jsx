import React from 'react';
import PropTypes from 'prop-types';

/**
 * A simple component that adds a Font Awesome green check mark next to its
 * children content
 */
const Verified = ({ children }) => (
  <p className="vads-u-margin--0 vads-u-padding-left--3">
    <i className="fa fa-check vads-u-color--green vads-u-margin-right--0p5 medium-screen:vads-u-margin-right--3 vads-u-margin-left--neg3" />{' '}
    {children}
  </p>
);

Verified.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Verified;
