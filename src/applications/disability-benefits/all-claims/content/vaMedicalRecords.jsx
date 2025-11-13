import React from 'react';
import { formatDate } from '../utils/dates/formatting';

const MONTH_YEAR = 'MMMM YYYY';

export const treatmentView = ({ formData }) => {
  const from = formData?.treatmentDateRange?.from;

  const name = formData?.treatmentCenterName;
  let treatmentPeriod = '';
  if (from) {
    treatmentPeriod = formatDate(from, MONTH_YEAR);
  }

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {treatmentPeriod}
    </div>
  );
};
