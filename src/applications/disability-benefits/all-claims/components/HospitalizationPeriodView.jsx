import React from 'react';
import { formatReviewDate } from 'us-forms-system/lib/js/helpers';

export default function HospitalizationPeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData.hospitalizationDateRange) {
    from = formatReviewDate(formData.hospitalizationDateRange.from);
    to = formatReviewDate(formData.hospitalizationDateRange.to);
  }

  return (
    <div>
      <p>{formData.hospitalName}</p>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
