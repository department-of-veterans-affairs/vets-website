import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationRatedDisabilities from './ConfirmationRatedDisabilities';
import ConfirmationNewDisabilities from './ConfirmationNewDisabilities';

// these are the legacy confirmation components for rated and new disabilities. A new component can be made for the new conditions format if that makes more sense.

const ConfirmationDisabilityConditions = ({ formData }) => {
  return (
    <>
      <ConfirmationRatedDisabilities formData={formData} />
      <ConfirmationNewDisabilities formData={formData} />
    </>
  );
};

ConfirmationDisabilityConditions.propTypes = {
  formData: PropTypes.object,
};

export default ConfirmationDisabilityConditions;
