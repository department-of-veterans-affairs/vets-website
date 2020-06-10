import React from 'react';

import { formatDateRange } from '../utils';

export default function EducationTrainingField({ formData }) {
  const { name, dates } = formData;

  return (
    <div>
      <strong>{name || ''}</strong>
      <p>{formatDateRange(dates)}</p>
    </div>
  );
}
