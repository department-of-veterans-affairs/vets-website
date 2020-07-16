import React from 'react';
import { formatDate, formatDateRange } from '../utils';

const MONTH_YEAR = 'MMMM YYYY';

// Replace XX day with 01 so moment can create a valid date
const replaceDay = date => date.replace('XX', '01');

export const treatmentView = ({ formData }) => {
  const { from, to } = formData.treatmentDateRange;

  const name = formData.treatmentCenterName || '';
  let treatmentPeriod = '';
  if (from && to) {
    treatmentPeriod = formatDateRange(
      { from: replaceDay(from), to: replaceDay(to) },
      MONTH_YEAR,
    );
  } else if (from || to) {
    treatmentPeriod = formatDate(replaceDay(from || to), MONTH_YEAR);
  }

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {treatmentPeriod}
    </div>
  );
};
