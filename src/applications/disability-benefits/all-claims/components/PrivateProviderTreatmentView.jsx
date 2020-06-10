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
