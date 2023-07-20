import React from 'react';
import { formatDate } from '../utils';
import { NO_FACILITY } from '../constants';

const MONTH_YEAR = 'MMMM YYYY';

// Replace XX day with 01 so moment can create a valid date
const replaceDay = date => date.replace('XX', '01');

export const treatmentView = ({ formData }) => {
  const { from } = formData.treatmentDateRange;

  const name = formData.treatmentCenterName || NO_FACILITY;
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
