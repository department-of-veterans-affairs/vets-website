import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationRatedDisabilities from './ConfirmationRatedDisabilities';
import ConfirmationNewDisabilities from './ConfirmationNewDisabilities';

// The ConfirmationNewDisabilities and ConfirmationRatedDisabilities are existing components.
// ConfirmationNewConditions is a new component to manage the new conditions workflow.

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
