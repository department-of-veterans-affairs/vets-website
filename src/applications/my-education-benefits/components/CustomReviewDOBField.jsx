import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function CustomReviewDOBField({ children }) {
  return (
    <div className="review-row">
      <dt>Your date of birth</dt>
      <dd>{formatReviewDate(children?.props.formData)}</dd>
    </div>
  );
}
