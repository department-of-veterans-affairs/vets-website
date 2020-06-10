import React from 'react';

import { formatDateRange } from '../utils';

export default function HospitalizationPeriodView({ formData }) {
  return (
    <div>
      <p>{formData.hospitalName}</p>
      <p>{formatDateRange(formData.hospitalizationDateRange)}</p>
    </div>
  );
}
