import React from 'react';

const SameOfficeReviewField = ({ children, uiSchema }) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{children?.props.formData ? 'Yes' : 'No'}</dd>
  </div>
);

export default SameOfficeReviewField;
