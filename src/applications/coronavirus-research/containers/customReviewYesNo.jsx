import React from 'react';

export default function CustomReviewYesNo({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title'].props.children[0]}</dt>
      <dd>{uiSchema['ui:options'].labels[(children?.props.formData)]}</dd>
    </div>
  );
}
