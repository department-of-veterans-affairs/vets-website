import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

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
