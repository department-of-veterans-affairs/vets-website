import React from 'react';
import { formatReviewDate } from 'us-forms-system/lib/js/helpers';

export default function PeriodOfConfinement({ formData }) {
  let from = '';
  let to = '';
  if (formData) {
    from = formatReviewDate(formData.from);
    to = formatReviewDate(formData.to);
  }

  return (
    <div>
      {from} &mdash; {to}
    </div>
  );
}
