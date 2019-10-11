import React from 'react';
import PropTypes from 'prop-types';

const PercentageCalloutBox = props => {
  const { value, isPercentage, label } = props;
  return (
    <div className="vads-u-background-color--gray-lightest">
      <p className="vads-u-padding-left--1p5 vads-u-padding-top--1p5 vads-u-margin--0 total-label">
        {label}
      </p>
      <p className="vads-u-padding-bottom--1p5 vads-u-padding-left--1p5 vads-u-margin--0 vads-u-font-size--2xl vads-u-font-family--sans vads-u-font-weight--bold total-rating">
        {value}
        {isPercentage ? '%' : ''}
      </p>
    </div>
  );
};

PercentageCalloutBox.propTypes = {
  value: PropTypes.number,
  isPercentage: PropTypes.bool,
  label: PropTypes.string,
};

export default PercentageCalloutBox;
