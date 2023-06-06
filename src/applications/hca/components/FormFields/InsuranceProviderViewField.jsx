import React from 'react';
import PropTypes from 'prop-types';

const InsuranceProviderViewField = ({ formData }) => (
  <div>
    <strong>{formData.insuranceName}</strong>
  </div>
);

InsuranceProviderViewField.propTypes = {
  formData: PropTypes.object,
};

export default InsuranceProviderViewField;
