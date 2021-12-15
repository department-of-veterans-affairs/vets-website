import React from 'react';

export default function CustomReviewYesNo({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title'].props.children.props.children}</dt>
      <dd>{children.props.formData ? 'Yes' : 'No'}</dd>
    </div>
  );
}
