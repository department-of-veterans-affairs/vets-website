import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function ValidatedServicePeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData.dateRange) {
    from = formatReviewDate(formData.dateRange.from);
    to = formatReviewDate(formData.dateRange.to);
  }

  return (
    <div>
      <strong>{formData.serviceBranch}</strong>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
