import React from 'react';
import { formatReviewDate } from 'us-forms-system/lib/js/helpers';

export default function HospitalizationPeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData.hospitalizationtDateRange) {
    from = formatReviewDate(formData.hospitalizationtDateRange.from);
    to = formatReviewDate(formData.hospitalizationDateRange.to);
  }

  return (
    <div>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
