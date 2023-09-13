import React from 'react';

import { formatDateRange } from '../utils';

export default function PrivateProviderTreatmentView({ formData }) {
  return (
    <div className="dd-privacy-mask">
      <strong>{formData.providerFacilityName}</strong>
      <p>{formatDateRange(formData.treatmentDateRange)}</p>
    </div>
  );
}
