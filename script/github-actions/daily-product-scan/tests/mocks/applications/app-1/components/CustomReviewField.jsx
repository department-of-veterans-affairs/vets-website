/* eslint-disable react/prop-types */
import React from 'react';

const CustomReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{formData}</dd>
  </div>
);

export default CustomReviewField;
