import React from 'react';
import { formatReviewDate } from 'us-forms-system/lib/js/helpers';

export default function HospitalizationPeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData.dateRange) {
    from = formatReviewDate(formData.dateRange.from);
    to = formatReviewDate(formData.dateRange.to);
  }

  return (
    <div>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
