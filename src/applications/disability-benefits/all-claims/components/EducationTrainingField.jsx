import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function EducationTrainingField({ formData }) {
  const { name, dates } = formData;
  let from = '';
  let to = '';
  if (dates) {
    from = formatReviewDate(dates.from);
    to = formatReviewDate(dates.to);
  }

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
