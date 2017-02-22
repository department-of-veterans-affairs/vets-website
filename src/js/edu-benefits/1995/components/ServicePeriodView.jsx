import React from 'react';
import { formatReviewDate } from '../../../common/schemaform/helpers';

export default function ServicePeriodView({ formData }) {
  const from = formatReviewDate(formData.dateRange.from);
  const to = formatReviewDate(formData.dateRange.to);
  return (
    <div>
      <strong>{formData.serviceBranch}</strong><br/>
      {from} &mdash; {to}
    </div>
  );
}
