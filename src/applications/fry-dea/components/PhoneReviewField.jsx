import React from 'react';

export default function PhoneReviewField({ uiSchema, formData }) {
  return (
    <>
      <div className="review-row">
        <dt>{uiSchema.phone['ui:title']}</dt>
        <dd>
          <va-telephone
            not-clickable
            contact={formData.phone}
            international={formData.isInternational}
          />
          {formData.isInternational && ' (International)'}
        </dd>
      </div>
    </>
  );
}
