import React from 'react';

export default function DynamicPhoneRadioReviewField({ children }) {
  return (
    <div className="review-row">
      <dt>
        How should we contact you if we have questions about your application?
      </dt>
      <dd
        style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
        }}
      >
        {children.props.formData}
      </dd>
    </div>
  );
}
