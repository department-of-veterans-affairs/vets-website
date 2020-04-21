import React from 'react';
import PropTypes from 'prop-types';

const Verified = ({ children }) => (
  <p className="vads-u-margin--0 vads-u-padding-left--3">
    <i className="fa fa-check vads-u-color--green vads-u-margin-right--0p5 vads-u-margin-left--neg3" />{' '}
    {children}
  </p>
);

Verified.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Verified;
