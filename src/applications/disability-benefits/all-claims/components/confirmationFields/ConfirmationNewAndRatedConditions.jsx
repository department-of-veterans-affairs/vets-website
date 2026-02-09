import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationDisCondNewDisabilities from './ConfirmationDisCondNewDisabilities';
import ConfirmationDisCondRatedDisabilities from './ConfirmationDisCondRatedDisabilities';

const ConfirmationNewAndRatedConditions = ({ formData }) => {
  return (
    <>
      <ConfirmationDisCondRatedDisabilities formData={formData} />
      <ConfirmationDisCondNewDisabilities formData={formData} />
    </>
  );
};

ConfirmationNewAndRatedConditions.propTypes = {
  formData: PropTypes.object,
};

export default ConfirmationNewAndRatedConditions;
