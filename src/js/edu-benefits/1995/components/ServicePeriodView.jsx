import React from 'react';

export default function ServicePeriodView({ formData }) {
  return (
    <div>
      <strong>{formData.serviceBranch}</strong><br/>
      {formData.dateRange.from} &mdash; {formData.dateRange.to}
    </div>
  );
}
