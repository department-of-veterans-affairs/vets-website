import React from 'react';

const NoHintReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="dd-privacy review-row" data-dd-privacy="mask">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{formData}</dd>
  </div>
);

export default NoHintReviewField;
