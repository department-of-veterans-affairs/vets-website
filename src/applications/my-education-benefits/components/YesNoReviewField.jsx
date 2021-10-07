import React from 'react';

export default function YesNoReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{children.props.formData ? 'Yes' : 'No'}</dd>
    </div>
  );
}
