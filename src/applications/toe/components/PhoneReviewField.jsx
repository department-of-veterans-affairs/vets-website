import React from 'react';

export default function PhoneReviewField({ uiSchema, formData }) {
  return (
    <>
      <div className="review-row">
        <dt>{uiSchema.phone['ui:title']}</dt>
        <dd>
          {formData.phone} {formData.isInternational && '(International)'}
        </dd>
      </div>
    </>
  );
}
