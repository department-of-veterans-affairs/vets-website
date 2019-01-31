import React from 'react';

export const treatmentView = ({ formData }) => {
  const { from, to } = formData.treatmentDateRange;

  const name = formData.treatmentCenterName || '';
  let treatmentPeriod = '';
  if (from && to) {
    treatmentPeriod = `${from} — ${to}`;
  } else if (from || to) {
    treatmentPeriod = `${from || to}`;
  }

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {treatmentPeriod}
    </div>
  );
};
