import React from 'react';

const NoHintReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{formData}</dd>
  </div>
);

export default NoHintReviewField;
