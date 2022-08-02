import React from 'react';

import { formatDateRange } from '../utils/dates';

export default function PrivateProviderTreatmentView({ formData }) {
  return (
    <div>
      <strong>{formData.providerFacilityName}</strong>
      <p>{formatDateRange(formData.treatmentDateRange)}</p>
    </div>
  );
}
