import React from 'react';
import { formatDateRange } from '../utils/dates/formatting';

export default function ValidatedServicePeriodView({ formData }) {
  return (
    <div className="vads-u-flex--fill">
      <strong>{formData?.serviceBranch}</strong>
      <p>{formatDateRange(formData?.dateRange)}</p>
    </div>
  );
}
