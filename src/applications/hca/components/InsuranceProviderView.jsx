import React from 'react';
import PropTypes from 'prop-types';

const InsuranceProviderView = ({ formData }) => (
  <div>
    <strong>{formData.insuranceName}</strong>
  </div>
);

InsuranceProviderView.propTypes = {
  formData: PropTypes.object,
};

export default InsuranceProviderView;
