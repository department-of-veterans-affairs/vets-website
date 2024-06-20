import PropTypes from 'prop-types';
import React from 'react';

import { formatDateRange } from '../utils';

export default function PrivateProviderTreatmentView({ formData }) {
  return (
    <div>
      <strong>{formData.providerFacilityName}</strong>
      <p>{formatDateRange(formData.treatmentDateRange)}</p>
    </div>
  );
}

PrivateProviderTreatmentView.propTypes = {
  formData: PropTypes.shape({
    providerFacilityName: PropTypes.string,
    treatmentDateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }),
};
