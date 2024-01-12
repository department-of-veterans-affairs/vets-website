import React from 'react';
import PropTypes from 'prop-types';

const InsuranceProviderViewField = ({ formData }) => (
  <div className="dd-privacy-hidden" data-dd-action-name="insurance provider">
    <strong>{formData.insuranceName}</strong>
  </div>
);

InsuranceProviderViewField.propTypes = {
  formData: PropTypes.object,
};

export default InsuranceProviderViewField;
