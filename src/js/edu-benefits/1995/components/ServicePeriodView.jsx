import React from 'react';

/**
 * Accepts YYYY-MM-DD and turns it into DD/MM/YYYY
 *
 * @param {String} date
 * @return {String}
 */
function formatDisplayDate(date) {
  return date.replace(/([\dX]{4})-([\dX]{2})-([\dX]{2})/, '$2/$3/$1');
}

export default function ServicePeriodView({ formData }) {
  const from = formatDisplayDate(formData.dateRange.from);
  const to = formatDisplayDate(formData.dateRange.to);
  return (
    <div>
      <strong>{formData.serviceBranch}</strong><br/>
      {from} &mdash; {to}
    </div>
  );
}
