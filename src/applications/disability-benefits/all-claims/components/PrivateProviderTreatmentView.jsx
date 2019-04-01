import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function PrivateProviderTreatmentView({ formData }) {
  let from = '';
  let to = '';

  if (formData.treatmentDateRange) {
    from = formatReviewDate(formData.treatmentDateRange.from);
    to = formatReviewDate(formData.treatmentDateRange.to);
  }

  return (
    <div>
      <strong>{formData.providerFacilityName}</strong>
      <br />
      {from}
      &nbsp;&mdash;&nbsp;
      {to}
    </div>
  );
}
