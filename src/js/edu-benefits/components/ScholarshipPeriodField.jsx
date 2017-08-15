import React from 'react';

export default function ScholarshipPeriodField({ formData }) {
  const noData = !formData.amount && !formData.year;

  return noData
      ? <div><strong>Scholarship</strong></div>
      : <div><strong>{formData.year}</strong><br/>${formData.amount}</div>;
}
