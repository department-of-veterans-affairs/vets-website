import React from 'react';
import { formatDateRange } from '../utils';

export default function ValidatedServicePeriodView({ formData }) {
  return (
    <div>
      <strong>{formData.serviceBranch}</strong>
      <p>{formatDateRange(formData.dateRange)}</p>
    </div>
  );
}
