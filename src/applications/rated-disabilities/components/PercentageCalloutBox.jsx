import React from 'react';
import PropTypes from 'prop-types';

const PercentageCalloutBox = ({ isPercentage, label, value }) => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-border-top--2px vads-u-text-align--center medium-screen:vads-u-text-align--right">
      <p className="vads-u-padding-right--1p5 vads-u-padding-top--1p5 vads-u-margin--0 total-label">
        {label}
      </p>
      <p className="vads-u-padding-bottom--1p5 vads-u-padding-right--1p5 vads-u-margin--0 vads-u-font-size--xl vads-u-font-family--sans vads-u-font-weight--bold total-rating">
        {value}
        {isPercentage ? '%' : ''}
      </p>
    </div>
  );
};

PercentageCalloutBox.propTypes = {
  isPercentage: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
};

export default PercentageCalloutBox;
