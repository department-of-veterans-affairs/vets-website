import PropTypes from 'prop-types';
import React from 'react';

export default function HospitalizationPeriodView({ formData }) {
  return <p>{formData.name}</p>;
}

HospitalizationPeriodView.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
  }),
};
