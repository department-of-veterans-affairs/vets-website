import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationNewDisabilities from './ConfirmationNewDisabilities';
import ConfirmationRatedDisabilities from './ConfirmationRatedDisabilities';

const ConfirmationNewAndRatedConditions = ({ formData }) => {
  return (
    <>
      <ConfirmationRatedDisabilities formData={formData} />
      <ConfirmationNewDisabilities formData={formData} />
    </>
  );
};

ConfirmationNewAndRatedConditions.propTypes = {
  formData: PropTypes.object,
};

export default ConfirmationNewAndRatedConditions;
