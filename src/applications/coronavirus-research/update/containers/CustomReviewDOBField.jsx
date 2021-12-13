import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function CustomReviewDOBField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{formatReviewDate(children?.props.formData)}</dd>
    </div>
  );
}
