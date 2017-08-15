import React from 'react';

export default function ScholarshipPeriodField({ formData }) {
  const noData = !formData.amount && !formData.year;

  return noData
      ? <div>This entry may be missing information</div>
      : <div><strong>{formData.year}</strong><br/>${formData.amount}</div>;
}
