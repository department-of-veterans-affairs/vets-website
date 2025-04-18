import React from 'react';
import { formatDate } from '../utils';

const MONTH_YEAR = 'MMMM YYYY';

// Replace XX day with 01 so moment can create a valid date
const replaceDay = date => date.replace('XX', '01');

export const treatmentView = ({ formData }) => {
  const from = formData?.treatmentDateRange?.from;

  const name = formData?.treatmentCenterName;
  let treatmentPeriod = '';
  if (from) {
    treatmentPeriod = formatDate(replaceDay(from), MONTH_YEAR);
  }

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {treatmentPeriod}
    </div>
  );
};
